import * as pdfjsLib from 'pdfjs-dist';
import type { DailyMenu } from '../types';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface TextItem {
    str: string;
    x: number;
    y: number;
    h: number; // height
}

const extractTextItemsFromPdf = async (loadingTask: any): Promise<TextItem[][]> => {
    try {
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const allPagesItems: TextItem[][] = [];

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const items: TextItem[] = textContent.items.map((item: any) => ({
                str: item.str,
                x: item.transform[4],
                y: item.transform[5],
                h: item.height
            }));

            allPagesItems.push(items);
        }

        return allPagesItems;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        return [];
    }
};

export const loadPDF = async (url: string): Promise<TextItem[][]> => {
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        return await extractTextItemsFromPdf(loadingTask);
    } catch (error) {
        console.error(`Error loading PDF from ${url}:`, error);
        return [];
    }
};

export const loadPDFData = async (data: Uint8Array): Promise<TextItem[][]> => {
    try {
        const loadingTask = pdfjsLib.getDocument({ data });
        return await extractTextItemsFromPdf(loadingTask);
    } catch (error) {
        console.error('Error loading PDF from data buffer:', error);
        return [];
    }
};

const cleanStr = (str: string) => str.trim().replace(/\s+/g, ' ');

export const parseMenuData = (pagesItems: TextItem[][], type: 'breakfast' | 'dinner'): DailyMenu[] => {
    const menus: DailyMenu[] = [];
    const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

    for (const items of pagesItems) {
        // Group by Y coordinate (rows) with some tolerance
        const rows: { y: number; items: TextItem[] }[] = [];
        const tolerance = 5; // pixels

        items.forEach(item => {
            if (!item.str.trim()) return;

            const existingRow = rows.find(r => Math.abs(r.y - item.y) < tolerance);
            if (existingRow) {
                existingRow.items.push(item);
            } else {
                rows.push({ y: item.y, items: [item] });
            }
        });

        // Sort rows top-to-bottom (PDF y is bottom-to-top usually, so higher y is first)
        rows.sort((a, b) => b.y - a.y);

        // Sort items in rows left-to-right
        rows.forEach(row => row.items.sort((a, b) => a.x - b.x));

        // Process rows
        for (const row of rows) {
            // Combine items to form the line text, but also keep them separate for column detection if needed
            // For now, let's assume the first item is Date, second is Day, rest are food
            // We need to handle cases where Date and Day might be in the same string or separate

            const lineStrings = row.items.map(i => cleanStr(i.str)).filter(s => s.length > 0);
            if (lineStrings.length < 3) continue; // Not enough data for a menu row

            const firstStr = lineStrings[0];
            const match = firstStr.match(dateRegex);

            if (match) {
                // Found a date row!
                const day = parseInt(match[1], 10);
                const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
                const year = parseInt(match[3], 10);
                const dateObj = new Date(year, month, day);

                // Assuming format: Date | Day | Food1 | Food2 ...
                // Sometimes Day might be merged with Date or separate
                let dayName = lineStrings[1];
                let foodStartIndex = 2;

                // Check if second item is actually a food (if day name is missing or merged)
                // But usually it's Date, Day, Food...

                // Collect food items
                // We filter out "kalori" if it's mixed in, or treat it separately
                const foodItems = lineStrings.slice(foodStartIndex);

                // Basic cleanup of food items (remove empty, remove 'kcal' if present and store it)
                const cleanFood: string[] = [];
                let calories = '';

                foodItems.forEach(f => {
                    if (f.toLowerCase().includes('kcal') || f.toLowerCase().includes('kalori')) {
                        calories = f;
                    } else if (f.length > 2 && !f.match(/^\d+$/)) { // Ignore small artifacts or pure numbers
                        cleanFood.push(f);
                    }
                });

                menus.push({
                    date: dateObj,
                    menu: {
                        date: firstStr,
                        day: dayName,
                        breakfast: type === 'breakfast' ? cleanFood : [],
                        dinner: type === 'dinner' ? cleanFood : [],
                        calories: calories // This might overwrite, but usually we just want one calorie count or display both? 
                        // Actually breakfast and dinner have different calories. 
                        // We'll store it in the respective list or add a field. 
                        // For now, let's just put it in the object, we can refine later.
                    }
                });
            }
        }
    }

    return menus;
};

export const mergeMenus = (breakfastMenus: DailyMenu[], dinnerMenus: DailyMenu[]): DailyMenu[] => {
    const merged: Map<string, DailyMenu> = new Map();

    // Helper to get key
    const getKey = (d: Date) => d.toISOString().split('T')[0];

    // Add breakfast
    breakfastMenus.forEach(m => {
        const key = getKey(m.date);
        merged.set(key, m);
    });

    // Merge dinner
    dinnerMenus.forEach(m => {
        const key = getKey(m.date);
        if (merged.has(key)) {
            const existing = merged.get(key)!;
            existing.menu.dinner = m.menu.dinner;
            // If dinner has calories, maybe append or separate? 
            // For now, let's ignore dinner calories or append
        } else {
            // If no breakfast for this day, just add dinner
            merged.set(key, m);
        }
    });

    return Array.from(merged.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
};

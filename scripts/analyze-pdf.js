import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Point to the local pdf.worker.min.mjs
// pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs');

async function analyzePDF(filename) {
    const pdfPath = path.join(__dirname, '../public/files', filename);
    const data = new Uint8Array(fs.readFileSync(pdfPath));

    try {
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        console.log(`\n--- Analyzing ${filename} ---`);
        console.log(`Pages: ${pdf.numPages}`);

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' | '); // Use pipe to see separation
            console.log(`\n[Page ${i} Content]:`);
            console.log(pageText);
        }
    } catch (error) {
        console.error(`Error analyzing ${filename}:`, error);
    }
}

async function main() {
    await analyzePDF('sabah_aralik.pdf');
    await analyzePDF('aksam_aralik.pdf');
}

main();

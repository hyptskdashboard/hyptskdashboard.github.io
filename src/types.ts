export interface MenuData {
    date: string; // Display date e.g. "01.12.2025"
    day: string; // e.g. "Pazartesi"
    breakfast: string[];
    dinner: string[];
    calories?: string;
}

export interface DailyMenu {
    date: Date; // JS Date object for sorting/finding
    menu: MenuData;
}

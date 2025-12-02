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

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    startAt?: string; // ISO date string (optional)
    endAt?: string;   // ISO date string; controls popup visibility
    createdAt: string;
}
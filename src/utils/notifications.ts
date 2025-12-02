import type { NotificationItem } from '../types';

const STORAGE_KEY = 'readNotificationIds';

export const getReadNotificationIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const markNotificationsRead = (ids: string[]) => {
    if (typeof window === 'undefined') return;
    try {
        const existing = new Set(getReadNotificationIds());
        ids.forEach(id => existing.add(id));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(existing)));
    } catch {
        // ignore
    }
};

export const filterActiveNotifications = (all: NotificationItem[], now: Date): NotificationItem[] => {
    return all.filter(n => {
        const startOk = !n.startAt || new Date(n.startAt) <= now;
        const endOk = !n.endAt || new Date(n.endAt) >= now;
        return startOk && endOk;
    });
};



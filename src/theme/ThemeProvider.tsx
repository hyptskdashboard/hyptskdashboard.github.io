import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
    mode: ThemeMode;
    toggleMode: () => void;
    setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'theme-mode';

const ThemeContext = createContext<ThemeContextValue>({
    mode: 'dark',
    toggleMode: () => undefined,
    setMode: () => undefined,
});

const getPreferredMode = (): ThemeMode => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    return prefersDark ? 'dark' : 'light';
};

const applyModeToDocument = (mode: ThemeMode) => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = mode;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const preferred = getPreferredMode();
        applyModeToDocument(preferred);
        return preferred;
    });

    useEffect(() => {
        applyModeToDocument(mode);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, mode);
        }
    }, [mode]);

    const setMode = (next: ThemeMode) => {
        setModeState(next);
    };

    const toggleMode = () => {
        setModeState(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const value = useMemo(
        () => ({
            mode,
            toggleMode,
            setMode,
        }),
        [mode]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useThemeMode must be used within ThemeProvider');
    }
    return ctx;
};



import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Check for saved preference
        const saved = localStorage.getItem('amart-theme');
        if (saved) setTheme(saved);
    }, []);

    useEffect(() => {
        // Apply to document root
        document.documentElement.classList.toggle('light', theme === 'light');
        localStorage.setItem('amart-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

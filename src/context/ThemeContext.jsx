import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check local storage or system preference on mount
        const storedTheme = localStorage.getItem('pneumoscan-theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const nextMode = !prevMode;
            if (nextMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('pneumoscan-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('pneumoscan-theme', 'light');
            }
            return nextMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

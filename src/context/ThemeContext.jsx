import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        // Brauzer xotirasidan tekshiramiz
        const savedSettings = localStorage.getItem("app-settings");
        if (savedSettings) {
            try {
                return JSON.parse(savedSettings);
            } catch (e) {
                console.error("Settings parse error", e);
            }
        }
        // Agar xotirada bo'lmasa, default holat
        return { darkMode: false };
    });

    useEffect(() => {
        // Sozlamalarni xotiraga saqlash
        localStorage.setItem("app-settings", JSON.stringify(settings));

        const root = document.documentElement;

        // Dark klassini boshqarish
        if (settings.darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [settings]);

    // Switch funksiyasi - faqat darkMode uchun emas, keyinchalik 
    // boshqa sozlamalar qo'shsang ham ishlayveradi
    const toggleSwitch = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <ThemeContext.Provider value={{ settings, toggleSwitch }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
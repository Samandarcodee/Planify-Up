import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { tgApp } from './lib/telegram';
// Initialize Telegram WebApp
if (typeof window !== 'undefined') {
    // Wait for Telegram WebApp to be ready
    const initTelegram = () => {
        if (window.Telegram?.WebApp) {
            tgApp.init();
            // Set theme colors based on Telegram theme
            const themeParams = tgApp.getThemeParams();
            if (themeParams.bg_color) {
                document.documentElement.style.setProperty('--background', themeParams.bg_color);
            }
            if (themeParams.text_color) {
                document.documentElement.style.setProperty('--foreground', themeParams.text_color);
            }
        }
        else {
            // Retry after a short delay if Telegram WebApp is not ready
            setTimeout(initTelegram, 100);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTelegram);
    }
    else {
        initTelegram();
    }
}
createRoot(document.getElementById("root")).render(_jsx(App, {}));

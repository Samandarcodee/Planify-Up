export class TelegramWebApp {
    static getInstance() {
        if (!TelegramWebApp.instance) {
            TelegramWebApp.instance = new TelegramWebApp();
        }
        return TelegramWebApp.instance;
    }
    isReady() {
        return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
    }
    init() {
        if (this.isReady()) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }
    getUser() {
        if (!this.isReady())
            return null;
        return window.Telegram.WebApp.initDataUnsafe.user || null;
    }
    getThemeParams() {
        if (!this.isReady())
            return {};
        return window.Telegram.WebApp.themeParams;
    }
    close() {
        if (this.isReady()) {
            window.Telegram.WebApp.close();
        }
    }
    showMainButton(text, callback) {
        if (!this.isReady())
            return;
        const mainButton = window.Telegram.WebApp.MainButton;
        mainButton.text = text;
        mainButton.onClick(callback);
        mainButton.show();
        mainButton.enable();
    }
    hideMainButton() {
        if (!this.isReady())
            return;
        window.Telegram.WebApp.MainButton.hide();
    }
    showBackButton(callback) {
        if (!this.isReady())
            return;
        const backButton = window.Telegram.WebApp.BackButton;
        backButton.onClick(callback);
        backButton.show();
    }
    hideBackButton() {
        if (!this.isReady())
            return;
        window.Telegram.WebApp.BackButton.hide();
    }
}
export const tgApp = TelegramWebApp.getInstance();

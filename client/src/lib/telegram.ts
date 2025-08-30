declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void;
        expand(): void;
        close(): void;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
        };
        BackButton: {
          isVisible: boolean;
          show(): void;
          hide(): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
        };
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export class TelegramWebApp {
  private static instance: TelegramWebApp;
  
  public static getInstance(): TelegramWebApp {
    if (!TelegramWebApp.instance) {
      TelegramWebApp.instance = new TelegramWebApp();
    }
    return TelegramWebApp.instance;
  }

  public isReady(): boolean {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  }

  public init(): void {
    if (this.isReady()) {
      window.Telegram!.WebApp.ready();
      window.Telegram!.WebApp.expand();
    }
  }

  public getUser(): TelegramUser | null {
    if (!this.isReady()) return null;
    return window.Telegram!.WebApp.initDataUnsafe.user || null;
  }

  public getThemeParams() {
    if (!this.isReady()) return {};
    return window.Telegram!.WebApp.themeParams;
  }

  public close(): void {
    if (this.isReady()) {
      window.Telegram!.WebApp.close();
    }
  }

  public showMainButton(text: string, callback: () => void): void {
    if (!this.isReady()) return;
    
    const mainButton = window.Telegram!.WebApp.MainButton;
    mainButton.text = text;
    mainButton.onClick(callback);
    mainButton.show();
    mainButton.enable();
  }

  public hideMainButton(): void {
    if (!this.isReady()) return;
    window.Telegram!.WebApp.MainButton.hide();
  }

  public showBackButton(callback: () => void): void {
    if (!this.isReady()) return;
    
    const backButton = window.Telegram!.WebApp.BackButton;
    backButton.onClick(callback);
    backButton.show();
  }

  public hideBackButton(): void {
    if (!this.isReady()) return;
    window.Telegram!.WebApp.BackButton.hide();
  }
}

export const tgApp = TelegramWebApp.getInstance();

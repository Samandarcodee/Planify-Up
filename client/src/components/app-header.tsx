import { User } from "lucide-react";
import { Bell } from "lucide-react";
import { tgApp } from "@/lib/telegram";

interface AppHeaderProps {
  userName?: string;
  onNotificationsClick?: () => void;
}

export function AppHeader({ userName, onNotificationsClick }: AppHeaderProps) {
  const telegramUser = tgApp.getUser();
  const displayName = userName || telegramUser?.first_name || "Foydalanuvchi";

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground" data-testid="greeting-text">
              Salom, {displayName}!
            </h1>
            <p className="text-sm text-muted-foreground">Bugungi kun uchun tayyor bo'lasizmi?</p>
          </div>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-muted transition-colors"
          onClick={onNotificationsClick}
          data-testid="button-notifications"
        >
          <Bell className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

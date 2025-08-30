import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { User } from "lucide-react";
import { Bell } from "lucide-react";
import { tgApp } from "@/lib/telegram";
import { useLanguage } from "@/lib/language";
export function AppHeader({ userName, onNotificationsClick }) {
    const telegramUser = tgApp.getUser();
    const { t } = useLanguage();
    const displayName = userName || telegramUser?.first_name || t('common.user');
    return (_jsx("header", { className: "sticky top-0 z-50 glass-effect border-b border-border px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-primary rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-6 h-6 text-primary-foreground" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold text-foreground", "data-testid": "greeting-text", children: t('dashboard.greeting', { name: displayName }) }), _jsx("p", { className: "text-sm text-muted-foreground", children: t('dashboard.ready') })] })] }), _jsx("button", { className: "p-2 rounded-full hover:bg-muted transition-colors", onClick: onNotificationsClick, "data-testid": "button-notifications", children: _jsx(Bell, { className: "w-6 h-6 text-muted-foreground" }) })] }) }));
}

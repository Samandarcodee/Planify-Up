import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Home, CheckSquare, Target, Calendar, User } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useLanguage } from "@/lib/language";
export function BottomNavigation() {
    const [location] = useLocation();
    const { t } = useLanguage();
    const navItems = [
        { path: "/", icon: Home, label: t('nav.home'), testId: "nav-home" },
        { path: "/tasks", icon: CheckSquare, label: t('nav.tasks'), testId: "nav-tasks" },
        { path: "/goals", icon: Target, label: t('nav.goals'), testId: "nav-goals" },
        { path: "/calendar", icon: Calendar, label: t('nav.calendar'), testId: "nav-calendar" },
        { path: "/profile", icon: User, label: t('nav.profile'), testId: "nav-profile" },
    ];
    return (_jsx("nav", { className: "fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[450px] bg-card border-t border-border", children: _jsx("div", { className: "flex justify-around py-2", children: navItems.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (_jsx(Link, { href: item.path, children: _jsxs("button", { className: `flex flex-col items-center space-y-1 p-3 transition-colors ${isActive
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"}`, "data-testid": item.testId, children: [_jsx(Icon, { className: "w-6 h-6" }), _jsx("span", { className: "nav-text font-medium text-overflow-fix", children: item.label })] }) }, item.path));
            }) }) }));
}

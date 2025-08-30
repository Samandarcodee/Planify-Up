import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { tgApp } from "./lib/telegram";
import { ThemeProvider } from "./lib/theme";
import { LanguageProvider } from "./lib/language";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Goals from "@/pages/goals";
import Calendar from "@/pages/calendar";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
function Router() {
    return (_jsxs(Switch, { children: [_jsx(Route, { path: "/", component: Dashboard }), _jsx(Route, { path: "/tasks", component: Tasks }), _jsx(Route, { path: "/goals", component: Goals }), _jsx(Route, { path: "/calendar", component: Calendar }), _jsx(Route, { path: "/profile", component: Profile }), _jsx(Route, { component: NotFound })] }));
}
function App() {
    useEffect(() => {
        // Initialize Telegram Web App
        tgApp.init();
    }, []);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(ThemeProvider, { defaultTheme: "system", storageKey: "vite-ui-theme", children: _jsx(LanguageProvider, { children: _jsx(TooltipProvider, { children: _jsxs("div", { className: "app-container min-h-screen bg-background", children: [_jsx(Toaster, {}), _jsx(Router, {})] }) }) }) }) }));
}
export default App;

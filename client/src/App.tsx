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
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/goals" component={Goals} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize Telegram Web App
    tgApp.init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <LanguageProvider>
          <TooltipProvider>
            <div className="app-container min-h-screen bg-background">
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

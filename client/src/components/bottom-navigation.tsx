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

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[450px] bg-card border-t border-border">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button 
                className={`flex flex-col items-center space-y-1 p-3 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={item.testId}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

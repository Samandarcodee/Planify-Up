import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TaskModal } from "@/components/task-modal";
import { GoalModal } from "@/components/goal-modal";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/lib/user-service";
import { useLanguage } from "@/lib/language";
export default function Dashboard() {
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [goalModalOpen, setGoalModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("");
    const { t } = useLanguage();
    const today = new Date().toISOString().split('T')[0];
    // Initialize user
    useEffect(() => {
        const initUser = async () => {
            const user = await userService.getCurrentUser();
            if (user) {
                setCurrentUserId(user.id);
                console.log('Dashboard user ID set:', user.id);
            }
        };
        initUser();
    }, []);
    // Fetch today's tasks
    const { data: todayTasks = [], isLoading: tasksLoading } = useQuery({
        queryKey: ["/api/tasks", currentUserId, "date", today],
        enabled: !!currentUserId,
    });
    // Fetch active goals
    const { data: activeGoals = [], isLoading: goalsLoading } = useQuery({
        queryKey: ["/api/goals", currentUserId, "active"],
        enabled: !!currentUserId,
    });
    // Fetch user stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["/api/stats", currentUserId],
        enabled: !!currentUserId,
    });
    // Fetch recent achievements
    const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
        queryKey: ["/api/achievements", currentUserId],
        enabled: !!currentUserId,
    });
    const completionPercentage = stats ? Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100) : 0;
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'long'
        });
    };
    const getDayOfWeek = (offset) => {
        const days = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
        const today = new Date();
        const day = new Date(today);
        day.setDate(today.getDate() + offset);
        return {
            name: days[day.getDay()],
            date: day.getDate(),
            isToday: offset === 0
        };
    };
    if (tasksLoading || goalsLoading || statsLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-muted-foreground", children: "Yuklanmoqda..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-background pb-20", children: [_jsx(AppHeader, {}), _jsxs("main", { className: "px-4", children: [_jsx("section", { className: "mt-6 mb-8", children: _jsxs("div", { className: "bg-gradient-to-br from-primary to-accent p-6 rounded-2xl text-primary-foreground mb-6 slide-up", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: t('dashboard.today') }), _jsx("p", { className: "text-primary-foreground/80", children: new Date().toLocaleDateString('uz-UZ', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }) })] }), _jsx(ProgressRing, { progress: completionPercentage, className: "text-primary-foreground" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", "data-testid": "text-completed-tasks", children: stats?.completedTasks || 0 }), _jsx("div", { className: "text-sm text-primary-foreground/80", children: t('dashboard.completed') })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", "data-testid": "text-total-tasks", children: todayTasks.length }), _jsx("div", { className: "text-sm text-primary-foreground/80", children: t('dashboard.total') })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", "data-testid": "text-streak", children: stats?.currentStreak || 0 }), _jsx("div", { className: "text-sm text-primary-foreground/80", children: t('dashboard.streak') })] })] })] }) }), _jsx("section", { className: "mb-8", children: _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Button, { variant: "outline", className: "h-auto p-3 justify-start", onClick: () => setTaskModalOpen(true), "data-testid": "button-add-task", children: _jsxs("div", { className: "flex items-center space-x-2 w-full", children: [_jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Plus, { className: "w-4 h-4 text-primary" }) }), _jsxs("div", { className: "text-left min-w-0 flex-1", children: [_jsx("div", { className: "font-medium text-xs text-overflow-fix", children: "Vazifa" }), _jsx("div", { className: "text-xs text-muted-foreground text-overflow-fix", children: "Qo'shish" })] })] }) }), _jsx(Button, { variant: "outline", className: "h-auto p-3 justify-start", onClick: () => setGoalModalOpen(true), "data-testid": "button-add-goal", children: _jsxs("div", { className: "flex items-center space-x-2 w-full", children: [_jsx("div", { className: "w-9 h-9 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Plus, { className: "w-4 h-4 text-accent" }) }), _jsxs("div", { className: "text-left min-w-0 flex-1", children: [_jsx("div", { className: "font-medium text-xs text-overflow-fix", children: "Maqsad" }), _jsx("div", { className: "text-xs text-muted-foreground text-overflow-fix", children: "Belgilash" })] })] }) })] }) }), _jsxs("section", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Bugungi vazifalar" }), _jsx(Button, { variant: "ghost", size: "sm", "data-testid": "button-view-all-tasks", children: "Barchasini ko'rish" })] }), todayTasks.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("p", { className: "text-muted-foreground", children: "Bugungi kun uchun vazifalar yo'q" }), _jsx(Button, { className: "mt-4", onClick: () => setTaskModalOpen(true), "data-testid": "button-add-first-task", children: "Birinchi vazifani qo'shing" })] }) })) : (_jsx("div", { className: "space-y-3", children: todayTasks.slice(0, 3).map((task) => (_jsx(TaskCard, { task: task }, task.id))) }))] }), _jsxs("section", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Faol maqsadlar" }), _jsx(Button, { variant: "ghost", size: "sm", "data-testid": "button-view-all-goals", children: "Barchasini ko'rish" })] }), activeGoals.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("p", { className: "text-muted-foreground", children: "Faol maqsadlar yo'q" }), _jsx(Button, { className: "mt-4", onClick: () => setGoalModalOpen(true), "data-testid": "button-add-first-goal", children: "Birinchi maqsadni belgilang" })] }) })) : (_jsx("div", { className: "space-y-4", children: activeGoals.slice(0, 2).map((goal) => (_jsx(GoalCard, { goal: goal }, goal.id))) }))] }), _jsxs("section", { className: "mb-8", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground mb-4", children: "Haftalik ko'rinish" }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-5", children: [_jsx("div", { className: "grid grid-cols-7 gap-2 mb-4", children: Array.from({ length: 7 }, (_, i) => i - 3).map((offset) => {
                                                const day = getDayOfWeek(offset);
                                                return (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: `text-xs mb-2 ${day.isToday ? 'text-primary' : 'text-muted-foreground'}`, children: day.name }), _jsx("div", { className: `w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center ${day.isToday
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground'}`, children: day.date })] }, offset));
                                            }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Bu hafta: ", stats?.weeklyCompletionRate || 0, "% bajarilgan"] }), _jsx(Button, { variant: "ghost", size: "sm", "data-testid": "button-view-calendar", children: "Kalendar" })] })] }) })] }), _jsxs("section", { className: "mb-8", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground mb-4", children: "Statistika" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-primary mb-1", "data-testid": "text-weekly-completion", children: [stats?.weeklyCompletionRate || 0, "%"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Haftalik bajarish" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-secondary mb-1", "data-testid": "text-completed-goals", children: stats?.completedGoals || 0 }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Bajarilgan maqsadlar" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent mb-1", "data-testid": "text-current-streak", children: stats?.currentStreak || 0 }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Joriy ketma-ketlik" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-foreground mb-1", "data-testid": "text-total-tasks-stat", children: stats?.totalTasks || 0 }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Jami vazifalar" })] }) })] })] })] }), _jsx(Button, { className: "fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-all duration-200", onClick: () => setTaskModalOpen(true), "data-testid": "button-quick-add", children: _jsx(Plus, { className: "w-6 h-6" }) }), _jsx(BottomNavigation, {}), _jsx(TaskModal, { open: taskModalOpen, onOpenChange: setTaskModalOpen, userId: currentUserId }), _jsx(GoalModal, { open: goalModalOpen, onOpenChange: setGoalModalOpen, userId: currentUserId })] }));
}
function TaskCard({ task }) {
    const getCategoryColor = (category) => {
        switch (category) {
            case 'salomatlik': return 'bg-secondary/10 text-secondary';
            case 'ish': return 'bg-primary/10 text-primary';
            case 'talim': return 'bg-accent/10 text-accent';
            default: return 'bg-muted text-muted-foreground';
        }
    };
    return (_jsx(Card, { className: "hover:shadow-md transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("button", { className: `w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${task.completed
                            ? 'bg-secondary border-secondary'
                            : 'border-muted-foreground hover:border-secondary'}`, "data-testid": `button-toggle-task-${task.id}`, children: task.completed && (_jsx("svg", { className: "w-3 h-3 text-secondary-foreground", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: `font-medium text-foreground ${task.completed ? 'line-through opacity-70' : ''}`, children: task.title }), task.time && (_jsx("div", { className: "text-sm text-muted-foreground", children: task.time }))] }), _jsx("div", { className: `text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`, children: task.category.charAt(0).toUpperCase() + task.category.slice(1) })] }) }) }));
}
function GoalCard({ goal }) {
    const progressPercentage = ((goal.currentValue || 0) / goal.targetValue) * 100;
    const getCategoryColor = (category) => {
        switch (category) {
            case 'salomatlik': return 'bg-secondary/10 text-secondary';
            case 'talim': return 'bg-accent/10 text-accent';
            case 'kasbiy': return 'bg-primary/10 text-primary';
            default: return 'bg-muted text-muted-foreground';
        }
    };
    return (_jsx(Card, { className: "hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-semibold text-foreground", children: goal.title }), _jsx("span", { className: `text-sm px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`, children: goal.category.charAt(0).toUpperCase() + goal.category.slice(1) })] }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "text-muted-foreground", children: "Jarayon" }), _jsxs("span", { className: "font-medium", children: [goal.currentValue || 0, "/", goal.targetValue, " ", goal.unit] })] }), _jsx("div", { className: "w-full bg-muted rounded-full h-2", children: _jsx("div", { className: "bg-secondary h-2 rounded-full transition-all duration-300", style: { width: `${Math.min(progressPercentage, 100)}%` } }) })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: ["Tugash: ", new Date(goal.deadline).toLocaleDateString('uz-UZ', {
                                    day: 'numeric',
                                    month: 'long'
                                })] }), _jsx(Button, { variant: "ghost", size: "sm", "data-testid": `button-update-goal-${goal.id}`, children: "Yangilash" })] })] }) }));
}

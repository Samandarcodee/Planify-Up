import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { GoalModal } from "@/components/goal-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { tgApp } from "@/lib/telegram";
import { useLanguage } from "@/lib/language";
export default function Goals() {
    const [goalModalOpen, setGoalModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("demo-user");
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { t } = useLanguage();
    useEffect(() => {
        const telegramUser = tgApp.getUser();
        if (telegramUser) {
            setCurrentUserId(telegramUser.id.toString());
        }
    }, []);
    const { data: allGoals = [], isLoading } = useQuery({
        queryKey: ["/api/goals", currentUserId],
        enabled: !!currentUserId,
    });
    const updateGoalMutation = useMutation({
        mutationFn: async ({ id, updates }) => {
            const response = await apiRequest("PATCH", `/api/goals/${id}`, updates);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/goals", currentUserId] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats", currentUserId] });
            toast({
                title: t('common.success'),
                description: t('goals.updated_success'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('goals.updated_error'),
                variant: "destructive",
            });
        },
    });
    const deleteGoalMutation = useMutation({
        mutationFn: async (id) => {
            const response = await apiRequest("DELETE", `/api/goals/${id}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/goals", currentUserId] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats", currentUserId] });
            toast({
                title: t('common.success'),
                description: t('goals.deleted_success'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('goals.deleted_error'),
                variant: "destructive",
            });
        },
    });
    const activeGoals = allGoals.filter(goal => !goal.completed);
    const completedGoals = allGoals.filter(goal => goal.completed);
    const incrementGoalProgress = (goal) => {
        if ((goal.currentValue || 0) < goal.targetValue) {
            const newValue = (goal.currentValue || 0) + 1;
            const completed = newValue >= goal.targetValue;
            updateGoalMutation.mutate({
                id: goal.id,
                updates: {
                    currentValue: newValue,
                    completed
                }
            });
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-muted-foreground", children: t('common.loading') })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-background pb-20", children: [_jsx(AppHeader, {}), _jsxs("main", { className: "px-4", children: [_jsxs("div", { className: "flex items-center justify-between my-6", children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: t('goals.title') }), _jsx(Button, { onClick: () => setGoalModalOpen(true), "data-testid": "button-add-goal", children: _jsx(Plus, { className: "w-4 h-4" }) })] }), _jsxs(Tabs, { defaultValue: "active", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "active", "data-testid": "tab-active-goals", children: [t('goals.active'), " (", activeGoals.length, ")"] }), _jsxs(TabsTrigger, { value: "completed", "data-testid": "tab-completed-goals", children: [t('goals.completed'), " (", completedGoals.length, ")"] })] }), _jsx(TabsContent, { value: "active", className: "mt-6", children: activeGoals.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("p", { className: "text-muted-foreground mb-4", children: "Faol maqsadlar yo'q" }), _jsx(Button, { onClick: () => setGoalModalOpen(true), "data-testid": "button-add-first-goal", children: "Maqsad belgilang" })] }) })) : (_jsx("div", { className: "space-y-4", children: activeGoals.map((goal) => (_jsx(GoalCard, { goal: goal, onIncrement: () => incrementGoalProgress(goal), onDelete: () => deleteGoalMutation.mutate(goal.id) }, goal.id))) })) }), _jsx(TabsContent, { value: "completed", className: "mt-6", children: completedGoals.length === 0 ? (_jsx(Card, { children: _jsx(CardContent, { className: "p-8 text-center", children: _jsx("p", { className: "text-muted-foreground", children: "Hali hech qanday maqsad bajarilmagan" }) }) })) : (_jsx("div", { className: "space-y-4", children: completedGoals.map((goal) => (_jsx(GoalCard, { goal: goal, onIncrement: () => { }, onDelete: () => deleteGoalMutation.mutate(goal.id) }, goal.id))) })) })] })] }), _jsx(Button, { className: "fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-all duration-200", onClick: () => setGoalModalOpen(true), "data-testid": "button-quick-add-goal", children: _jsx(Plus, { className: "w-6 h-6" }) }), _jsx(BottomNavigation, {}), _jsx(GoalModal, { open: goalModalOpen, onOpenChange: setGoalModalOpen, userId: currentUserId })] }));
}
function GoalCard({ goal, onIncrement, onDelete }) {
    const progressPercentage = ((goal.currentValue || 0) / goal.targetValue) * 100;
    const getCategoryColor = (category) => {
        switch (category) {
            case 'salomatlik': return 'bg-secondary/10 text-secondary';
            case 'talim': return 'bg-accent/10 text-accent';
            case 'kasbiy': return 'bg-primary/10 text-primary';
            default: return 'bg-muted text-muted-foreground';
        }
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'long'
        });
    };
    return (_jsx(Card, { className: "hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-semibold text-foreground", children: goal.title }), _jsx("span", { className: `text-sm px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`, children: goal.category.charAt(0).toUpperCase() + goal.category.slice(1) })] }), goal.description && (_jsx("p", { className: "text-sm text-muted-foreground mb-3", children: goal.description })), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "text-muted-foreground", children: "Jarayon" }), _jsxs("span", { className: "font-medium", children: [goal.currentValue || 0, "/", goal.targetValue, " ", goal.unit] })] }), _jsx(Progress, { value: progressPercentage, className: "h-2" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-muted-foreground", children: ["Tugash: ", formatDate(goal.deadline)] }), _jsxs("div", { className: "flex space-x-2", children: [!goal.completed && (goal.currentValue || 0) < goal.targetValue && (_jsx(Button, { size: "sm", onClick: onIncrement, "data-testid": `button-increment-goal-${goal.id}`, children: "+1" })), _jsx(Button, { size: "sm", variant: "destructive", onClick: onDelete, "data-testid": `button-delete-goal-${goal.id}`, children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] }) }));
}

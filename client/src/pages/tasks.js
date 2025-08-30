import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TaskModal } from "@/components/task-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/lib/user-service";
import { useLanguage } from "@/lib/language";
export default function Tasks() {
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { t } = useLanguage();
    useEffect(() => {
        const initUser = async () => {
            const user = await userService.getCurrentUser();
            if (user) {
                setCurrentUserId(user.id);
                console.log('Tasks page user ID set:', user.id);
            }
        };
        initUser();
    }, []);
    const { data: allTasks = [], isLoading } = useQuery({
        queryKey: ["/api/tasks", currentUserId],
        enabled: !!currentUserId,
    });
    const updateTaskMutation = useMutation({
        mutationFn: async ({ id, updates }) => {
            const response = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/tasks", currentUserId] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats", currentUserId] });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('tasks.updated_error'),
                variant: "destructive",
            });
        },
    });
    const deleteTaskMutation = useMutation({
        mutationFn: async (id) => {
            const response = await apiRequest("DELETE", `/api/tasks/${id}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/tasks", currentUserId] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats", currentUserId] });
            toast({
                title: t('common.success'),
                description: t('tasks.deleted_success'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('tasks.deleted_error'),
                variant: "destructive",
            });
        },
    });
    const toggleTaskCompletion = (task) => {
        updateTaskMutation.mutate({
            id: task.id,
            updates: { completed: !task.completed }
        });
    };
    const filteredTasks = allTasks.filter(task => filterCategory === "all" || task.category === filterCategory);
    const activeTasks = filteredTasks.filter(task => !task.completed);
    const completedTasks = filteredTasks.filter(task => task.completed);
    const getCategoryColor = (category) => {
        switch (category) {
            case 'salomatlik': return 'bg-secondary/10 text-secondary';
            case 'ish': return 'bg-primary/10 text-primary';
            case 'talim': return 'bg-accent/10 text-accent';
            default: return 'bg-muted text-muted-foreground';
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-muted-foreground", children: t('common.loading') })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-background pb-20", children: [_jsx(AppHeader, {}), _jsxs("main", { className: "px-4", children: [_jsxs("div", { className: "flex items-center justify-between my-6", children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: t('tasks.title') }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Select, { value: filterCategory, onValueChange: setFilterCategory, children: [_jsx(SelectTrigger, { className: "w-32", "data-testid": "select-filter-category", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Barchasi" }), _jsx(SelectItem, { value: "ish", children: "Ish" }), _jsx(SelectItem, { value: "salomatlik", children: "Salomatlik" }), _jsx(SelectItem, { value: "talim", children: "Ta'lim" }), _jsx(SelectItem, { value: "shaxsiy", children: "Shaxsiy" })] })] }), _jsx(Button, { onClick: () => setTaskModalOpen(true), "data-testid": "button-add-task", children: _jsx(Plus, { className: "w-4 h-4" }) })] })] }), _jsxs(Tabs, { defaultValue: "active", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "active", "data-testid": "tab-active-tasks", children: ["Faol (", activeTasks.length, ")"] }), _jsxs(TabsTrigger, { value: "completed", "data-testid": "tab-completed-tasks", children: ["Bajarilgan (", completedTasks.length, ")"] })] }), _jsx(TabsContent, { value: "active", className: "mt-6", children: activeTasks.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("p", { className: "text-muted-foreground mb-4", children: "Faol vazifalar yo'q" }), _jsx(Button, { onClick: () => setTaskModalOpen(true), "data-testid": "button-add-first-active-task", children: "Vazifa qo'shing" })] }) })) : (_jsx("div", { className: "space-y-3", children: activeTasks.map((task) => (_jsx(TaskCard, { task: task, onToggle: () => toggleTaskCompletion(task), onDelete: () => deleteTaskMutation.mutate(task.id) }, task.id))) })) }), _jsx(TabsContent, { value: "completed", className: "mt-6", children: completedTasks.length === 0 ? (_jsx(Card, { children: _jsx(CardContent, { className: "p-8 text-center", children: _jsx("p", { className: "text-muted-foreground", children: "Hali hech qanday vazifa bajarilmagan" }) }) })) : (_jsx("div", { className: "space-y-3", children: completedTasks.map((task) => (_jsx(TaskCard, { task: task, onToggle: () => toggleTaskCompletion(task), onDelete: () => deleteTaskMutation.mutate(task.id) }, task.id))) })) })] })] }), _jsx(BottomNavigation, {}), _jsx(TaskModal, { open: taskModalOpen, onOpenChange: setTaskModalOpen, userId: currentUserId })] }));
}
function TaskCard({ task, onToggle, onDelete }) {
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
                            : 'border-muted-foreground hover:border-secondary'}`, onClick: onToggle, "data-testid": `button-toggle-task-${task.id}`, children: task.completed && (_jsx("svg", { className: "w-3 h-3 text-secondary-foreground", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: `font-medium text-foreground ${task.completed ? 'line-through opacity-70' : ''}`, children: task.title }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [task.time && `${task.time} • `, new Date(task.date).toLocaleDateString('uz-UZ')] })] }), _jsx("div", { className: `text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`, children: task.category.charAt(0).toUpperCase() + task.category.slice(1) })] }) }) }));
}

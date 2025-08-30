import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TaskModal } from "@/components/task-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/lib/user-service";
export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("");
    useEffect(() => {
        const initUser = async () => {
            const user = await userService.getCurrentUser();
            if (user) {
                setCurrentUserId(user.id);
                console.log('Calendar user ID set:', user.id);
            }
        };
        initUser();
    }, []);
    const { data: allTasks = [] } = useQuery({
        queryKey: ["/api/tasks", currentUserId],
        enabled: !!currentUserId,
    });
    const getMonthDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const days = [];
        // Previous month days
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({
                date: date.getDate(),
                isCurrentMonth: false,
                fullDate: date.toISOString().split('T')[0],
                tasks: []
            });
        }
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const dayTasks = allTasks.filter(task => task.date === dateStr);
            days.push({
                date: day,
                isCurrentMonth: true,
                fullDate: dateStr,
                tasks: dayTasks,
                isToday: dateStr === new Date().toISOString().split('T')[0]
            });
        }
        return days;
    };
    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };
    const selectedDateTasks = selectedDate
        ? allTasks.filter(task => task.date === selectedDate)
        : [];
    const monthNames = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    const weekDays = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
    return (_jsxs("div", { className: "min-h-screen bg-background pb-20", children: [_jsx(AppHeader, {}), _jsxs("main", { className: "px-4", children: [_jsxs("div", { className: "flex items-center justify-between my-6", children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Kalendar" }), _jsx(Button, { onClick: () => setTaskModalOpen(true), "data-testid": "button-add-task", children: _jsx(Plus, { className: "w-4 h-4" }) })] }), _jsx(Card, { className: "mb-6", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "text-xl font-semibold text-foreground", children: [monthNames[currentDate.getMonth()], " ", currentDate.getFullYear()] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => navigateMonth('prev'), "data-testid": "button-prev-month", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => navigateMonth('next'), "data-testid": "button-next-month", children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: weekDays.map(day => (_jsx("div", { className: "text-center text-sm font-medium text-muted-foreground py-2", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: getMonthDays().map((day, index) => (_jsxs("button", { className: `
                    relative p-2 rounded-lg text-sm transition-colors min-h-[40px]
                    ${day.isCurrentMonth
                                            ? 'text-foreground hover:bg-muted'
                                            : 'text-muted-foreground opacity-50'}
                    ${day.isToday ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                    ${selectedDate === day.fullDate ? 'ring-2 ring-ring' : ''}
                  `, onClick: () => setSelectedDate(day.fullDate), "data-testid": `button-calendar-day-${day.fullDate}`, children: [_jsx("span", { children: day.date }), day.tasks.length > 0 && (_jsx("div", { className: "absolute bottom-1 left-1/2 transform -translate-x-1/2", children: _jsx("div", { className: "w-1 h-1 bg-secondary rounded-full" }) }))] }, index))) })] }) }), selectedDate && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("h3", { className: "font-semibold text-foreground mb-4", children: [new Date(selectedDate).toLocaleDateString('uz-UZ', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }), " kunidagi vazifalar"] }), selectedDateTasks.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-muted-foreground mb-4", children: "Bu kun uchun vazifalar yo'q" }), _jsx(Button, { onClick: () => setTaskModalOpen(true), "data-testid": "button-add-task-for-date", children: "Vazifa qo'shing" })] })) : (_jsx("div", { className: "space-y-3", children: selectedDateTasks.map((task) => (_jsxs("div", { className: "flex items-center space-x-3 p-3 bg-muted/50 rounded-lg", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${task.completed ? 'bg-secondary' : 'bg-muted-foreground'}` }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: `font-medium ${task.completed ? 'line-through opacity-70' : ''}`, children: task.title }), task.time && (_jsx("div", { className: "text-sm text-muted-foreground", children: task.time }))] }), _jsx("div", { className: "text-xs bg-primary/10 text-primary px-2 py-1 rounded-full", children: task.category })] }, task.id))) }))] }) }))] }), _jsx(BottomNavigation, {}), _jsx(TaskModal, { open: taskModalOpen, onOpenChange: setTaskModalOpen, userId: currentUserId })] }));
}

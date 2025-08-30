import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertTaskSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
const taskCategories = [
    { value: "ish", label: "Ish" },
    { value: "salomatlik", label: "Salomatlik" },
    { value: "talim", label: "Ta'lim" },
    { value: "shaxsiy", label: "Shaxsiy" },
];
export function TaskModal({ open, onOpenChange, userId }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(insertTaskSchema),
        defaultValues: {
            userId,
            title: "",
            description: "",
            category: "",
            time: "",
            date: new Date().toISOString().split('T')[0],
            completed: false,
        },
    });
    const createTaskMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiRequest("POST", "/api/tasks", data);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/tasks", userId] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats", userId] });
            toast({
                title: "Muvaffaqiyat!",
                description: "Vazifa muvaffaqiyatli qo'shildi.",
            });
            onOpenChange(false);
            form.reset();
        },
        onError: () => {
            toast({
                title: "Xatolik!",
                description: "Vazifa qo'shishda xatolik yuz berdi.",
                variant: "destructive",
            });
        },
    });
    const onSubmit = (data) => {
        createTaskMutation.mutate(data);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] rounded-t-2xl border-0 bg-card", children: [_jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }), _jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-lg font-semibold", children: "Yangi vazifa qo'shish" }) }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Vazifa nomi" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Vazifa nomini kiriting...", ...field, "data-testid": "input-task-title" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "category", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Kategoriya" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { "data-testid": "select-task-category", children: _jsx(SelectValue, { placeholder: "Kategoriya tanlang" }) }) }), _jsx(SelectContent, { children: taskCategories.map((category) => (_jsx(SelectItem, { value: category.value, children: category.label }, category.value))) })] }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(FormField, { control: form.control, name: "time", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Vaqt" }), _jsx(FormControl, { children: _jsx(Input, { type: "time", ...field, "data-testid": "input-task-time" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "date", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Sana" }), _jsx(FormControl, { children: _jsx(Input, { type: "date", ...field, "data-testid": "input-task-date" }) }), _jsx(FormMessage, {})] })) })] }), _jsxs("div", { className: "flex space-x-3 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: () => onOpenChange(false), "data-testid": "button-cancel-task", children: "Bekor qilish" }), _jsx(Button, { type: "submit", className: "flex-1", disabled: createTaskMutation.isPending, "data-testid": "button-submit-task", children: createTaskMutation.isPending ? "Qo'shilmoqda..." : "Qo'shish" })] })] }) })] }) }));
}

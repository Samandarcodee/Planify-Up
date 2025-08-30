import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertGoalSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
const goalCategories = [
    { value: "salomatlik", label: "Salomatlik" },
    { value: "talim", label: "Ta'lim" },
    { value: "kasbiy", label: "Kasbiy rivojlanish" },
    { value: "moliyaviy", label: "Moliyaviy" },
    { value: "shaxsiy", label: "Shaxsiy" },
];
export function GoalModal({ open, onOpenChange, userId }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(insertGoalSchema),
        defaultValues: {
            userId,
            title: "",
            description: "",
            category: "",
            targetValue: 1,
            currentValue: 0,
            unit: "kun",
            deadline: "",
            completed: false,
        },
    });
    const createGoalMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiRequest("POST", "/api/goals", data);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/goals", userId] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats", userId] });
            toast({
                title: "Muvaffaqiyat!",
                description: "Maqsad muvaffaqiyatli yaratildi.",
            });
            onOpenChange(false);
            form.reset();
        },
        onError: () => {
            toast({
                title: "Xatolik!",
                description: "Maqsad yaratishda xatolik yuz berdi.",
                variant: "destructive",
            });
        },
    });
    const onSubmit = (data) => {
        createGoalMutation.mutate(data);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] rounded-t-2xl border-0 bg-card", children: [_jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }), _jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-lg font-semibold", children: "Yangi maqsad belgilash" }) }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Maqsad nomi" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Maqsad nomini kiriting...", ...field, "data-testid": "input-goal-title" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Tavsif" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Maqsad haqida batafsil...", rows: 3, ...field, value: field.value || '', "data-testid": "textarea-goal-description" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "category", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Kategoriya" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { "data-testid": "select-goal-category", children: _jsx(SelectValue, { placeholder: "Kategoriya tanlang" }) }) }), _jsx(SelectContent, { children: goalCategories.map((category) => (_jsx(SelectItem, { value: category.value, children: category.label }, category.value))) })] }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(FormField, { control: form.control, name: "targetValue", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Maqsad qiymati" }), _jsx(FormControl, { children: _jsx(Input, { type: "number", min: "1", ...field, onChange: (e) => field.onChange(parseInt(e.target.value) || 1), "data-testid": "input-goal-target" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "unit", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Birlik" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "kun, dars, kitob...", ...field, "data-testid": "input-goal-unit" }) }), _jsx(FormMessage, {})] })) })] }), _jsx(FormField, { control: form.control, name: "deadline", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Tugash sanasi" }), _jsx(FormControl, { children: _jsx(Input, { type: "date", ...field, "data-testid": "input-goal-deadline" }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "flex space-x-3 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: () => onOpenChange(false), "data-testid": "button-cancel-goal", children: "Bekor qilish" }), _jsx(Button, { type: "submit", className: "flex-1", disabled: createGoalMutation.isPending, "data-testid": "button-submit-goal", children: createGoalMutation.isPending ? "Yaratilmoqda..." : "Yaratish" })] })] }) })] }) }));
}

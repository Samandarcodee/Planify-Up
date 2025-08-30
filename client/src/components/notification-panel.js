import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Bell, Send, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/language";
export function NotificationPanel({ userId }) {
    const [selectedType, setSelectedType] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();
    const { t } = useLanguage();
    const notificationTypes = [
        { value: "motivation", label: "💪 Motivatsion xabar" },
        { value: "achievement", label: "🏆 Yutuq testi" },
        { value: "task_reminder", label: "⏰ Vazifa eslatmasi" },
        { value: "goal_progress", label: "🎯 Maqsad progressi" }
    ];
    const sendNotification = async () => {
        if (!selectedType) {
            toast({
                title: "Xato",
                description: "Xabar turini tanlang",
                variant: "destructive"
            });
            return;
        }
        setIsSending(true);
        try {
            const response = await apiRequest("POST", "/api/notifications/send", {
                userId,
                type: selectedType
            });
            if (response.ok) {
                toast({
                    title: "Muvaffaqiyat!",
                    description: "Xabar yuborildi",
                });
            }
            else {
                throw new Error("Xabar yuborishda xato");
            }
        }
        catch (error) {
            toast({
                title: "Xato",
                description: "Xabar yuborishda muammo yuz berdi",
                variant: "destructive"
            });
        }
        finally {
            setIsSending(false);
        }
    };
    const sendTestNotification = async () => {
        setIsSending(true);
        try {
            const response = await apiRequest("POST", "/api/notifications/test");
            if (response.ok) {
                toast({
                    title: "Test muvaffaqiyatli!",
                    description: "Test xabar yuborildi",
                });
            }
            else {
                throw new Error("Test xabar yuborishda xato");
            }
        }
        catch (error) {
            toast({
                title: "Xato",
                description: "Test xabar yuborishda muammo yuz berdi",
                variant: "destructive"
            });
        }
        finally {
            setIsSending(false);
        }
    };
    return (_jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Bell, { className: "h-5 w-5" }), "\uD83D\uDCF1 Push Xabarlar Testi"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Xabar turi:" }), _jsxs(Select, { value: selectedType, onValueChange: setSelectedType, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Xabar turini tanlang" }) }), _jsx(SelectContent, { children: notificationTypes.map((type) => (_jsx(SelectItem, { value: type.value, children: type.label }, type.value))) })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: sendNotification, disabled: isSending || !selectedType, className: "flex-1", children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), isSending ? "Yuborilmoqda..." : "Xabar yuborish"] }), _jsxs(Button, { onClick: sendTestNotification, disabled: isSending, variant: "outline", children: [_jsx(TestTube, { className: "h-4 w-4 mr-2" }), "Test"] })] }), _jsxs("div", { className: "text-xs text-muted-foreground space-y-1", children: [_jsxs("p", { children: ["\uD83D\uDD14 ", _jsx("strong", { children: "Automatic xabarlar:" })] }), _jsx("p", { children: "\u2022 Har 30 daqiqada vazifa eslatmalari" }), _jsx("p", { children: "\u2022 Ertalab 9:00 da motivatsion xabarlar" }), _jsx("p", { children: "\u2022 Kechqurun 20:00 da kunlik xulosa" }), _jsx("p", { children: "\u2022 Yakshanba 18:00 da haftalik hisobot" })] })] })] }));
}

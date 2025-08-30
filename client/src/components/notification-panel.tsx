import { useState } from "react";
import { Bell, Send, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/language";

interface NotificationPanelProps {
  userId: string;
}

export function NotificationPanel({ userId }: NotificationPanelProps) {
  const [selectedType, setSelectedType] = useState<string>("");
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
      } else {
        throw new Error("Xabar yuborishda xato");
      }
    } catch (error) {
      toast({
        title: "Xato",
        description: "Xabar yuborishda muammo yuz berdi",
        variant: "destructive"
      });
    } finally {
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
      } else {
        throw new Error("Test xabar yuborishda xato");
      }
    } catch (error) {
      toast({
        title: "Xato",
        description: "Test xabar yuborishda muammo yuz berdi",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          📱 Push Xabarlar Testi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Xabar turi:</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Xabar turini tanlang" />
            </SelectTrigger>
            <SelectContent>
              {notificationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={sendNotification}
            disabled={isSending || !selectedType}
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Yuborilmoqda..." : "Xabar yuborish"}
          </Button>
          
          <Button 
            onClick={sendTestNotification}
            disabled={isSending}
            variant="outline"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Test
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>🔔 <strong>Automatic xabarlar:</strong></p>
          <p>• Har 30 daqiqada vazifa eslatmalari</p>
          <p>• Ertalab 9:00 da motivatsion xabarlar</p>
          <p>• Kechqurun 20:00 da kunlik xulosa</p>
          <p>• Yakshanba 18:00 da haftalik hisobot</p>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import { type Goal } from "@shared/schema";

export default function Goals() {
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("demo-user");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    const telegramUser = tgApp.getUser();
    if (telegramUser) {
      setCurrentUserId(telegramUser.id.toString());
    }
  }, []);

  const { data: allGoals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals", currentUserId],
    enabled: !!currentUserId,
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Goal> }) => {
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
    mutationFn: async (id: string) => {
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

  const incrementGoalProgress = (goal: Goal) => {
    if (goal.currentValue < goal.targetValue) {
      const newValue = goal.currentValue + 1;
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="px-4">
        <div className="flex items-center justify-between my-6">
          <h1 className="text-2xl font-bold text-foreground">{t('goals.title')}</h1>
          <Button onClick={() => setGoalModalOpen(true)} data-testid="button-add-goal">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" data-testid="tab-active-goals">
              {t('goals.active')} ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-goals">
              {t('goals.completed')} ({completedGoals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Faol maqsadlar yo'q</p>
                  <Button onClick={() => setGoalModalOpen(true)} data-testid="button-add-first-goal">
                    Maqsad belgilang
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    onIncrement={() => incrementGoalProgress(goal)}
                    onDelete={() => deleteGoalMutation.mutate(goal.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedGoals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Hali hech qanday maqsad bajarilmagan</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedGoals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    onIncrement={() => {}}
                    onDelete={() => deleteGoalMutation.mutate(goal.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
        onClick={() => setGoalModalOpen(true)}
        data-testid="button-quick-add-goal"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <BottomNavigation />
      
      <GoalModal 
        open={goalModalOpen} 
        onOpenChange={setGoalModalOpen}
        userId={currentUserId}
      />
    </div>
  );
}

interface GoalCardProps {
  goal: Goal;
  onIncrement: () => void;
  onDelete: () => void;
}

function GoalCard({ goal, onIncrement, onDelete }: GoalCardProps) {
  const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'salomatlik': return 'bg-secondary/10 text-secondary';
      case 'talim': return 'bg-accent/10 text-accent';
      case 'kasbiy': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">{goal.title}</h4>
          <span className={`text-sm px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
          </span>
        </div>
        
        {goal.description && (
          <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
        )}
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Jarayon</span>
            <span className="font-medium">
              {goal.currentValue}/{goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Tugash: {formatDate(goal.deadline)}
          </span>
          <div className="flex space-x-2">
            {!goal.completed && goal.currentValue < goal.targetValue && (
              <Button 
                size="sm" 
                onClick={onIncrement}
                data-testid={`button-increment-goal-${goal.id}`}
              >
                +1
              </Button>
            )}
            <Button 
              size="sm" 
              variant="destructive"
              onClick={onDelete}
              data-testid={`button-delete-goal-${goal.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

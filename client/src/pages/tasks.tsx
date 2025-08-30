import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
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
import { type Task } from "@shared/schema";

export default function Tasks() {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
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

  const { data: allTasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", currentUserId],
    enabled: !!currentUserId,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
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
    mutationFn: async (id: string) => {
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

  const toggleTaskCompletion = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { completed: !task.completed }
    });
  };

  const filteredTasks = allTasks.filter(task => 
    filterCategory === "all" || task.category === filterCategory
  );

  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'salomatlik': return 'bg-secondary/10 text-secondary';
      case 'ish': return 'bg-primary/10 text-primary';
      case 'talim': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
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
          <h1 className="text-2xl font-bold text-foreground">{t('tasks.title')}</h1>
          <div className="flex space-x-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32" data-testid="select-filter-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="ish">Ish</SelectItem>
                <SelectItem value="salomatlik">Salomatlik</SelectItem>
                <SelectItem value="talim">Ta'lim</SelectItem>
                <SelectItem value="shaxsiy">Shaxsiy</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setTaskModalOpen(true)} data-testid="button-add-task">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" data-testid="tab-active-tasks">
              Faol ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-tasks">
              Bajarilgan ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {activeTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Faol vazifalar yo'q</p>
                  <Button onClick={() => setTaskModalOpen(true)} data-testid="button-add-first-active-task">
                    Vazifa qo'shing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleTaskCompletion(task)}
                    onDelete={() => deleteTaskMutation.mutate(task.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Hali hech qanday vazifa bajarilmagan</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleTaskCompletion(task)}
                    onDelete={() => deleteTaskMutation.mutate(task.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
      
      <TaskModal 
        open={taskModalOpen} 
        onOpenChange={setTaskModalOpen}
        userId={currentUserId}
      />
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'salomatlik': return 'bg-secondary/10 text-secondary';
      case 'ish': return 'bg-primary/10 text-primary';
      case 'talim': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <button 
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-secondary border-secondary' 
                : 'border-muted-foreground hover:border-secondary'
            }`}
            onClick={onToggle}
            data-testid={`button-toggle-task-${task.id}`}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-secondary-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <div className={`font-medium text-foreground ${task.completed ? 'line-through opacity-70' : ''}`}>
              {task.title}
            </div>
            <div className="text-sm text-muted-foreground">
              {task.time && `${task.time} • `}
              {new Date(task.date).toLocaleDateString('uz-UZ')}
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

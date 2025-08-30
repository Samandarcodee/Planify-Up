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
import { tgApp } from "@/lib/telegram";
import { type Task, type Goal, type Achievement } from "@shared/schema";

export default function Dashboard() {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("demo-user");

  const today = new Date().toISOString().split('T')[0];

  // Initialize user from Telegram
  useEffect(() => {
    const telegramUser = tgApp.getUser();
    if (telegramUser) {
      setCurrentUserId(telegramUser.id.toString());
    }
  }, []);

  // Fetch today's tasks
  const { data: todayTasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", currentUserId, "date", today],
    enabled: !!currentUserId,
  });

  // Fetch active goals
  const { data: activeGoals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals", currentUserId, "active"],
    enabled: !!currentUserId,
  });

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats", currentUserId],
    enabled: !!currentUserId,
  });

  // Fetch recent achievements
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements", currentUserId],
    enabled: !!currentUserId,
  });

  const completionPercentage = stats ? Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100) : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getDayOfWeek = (offset: number) => {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="px-4">
        {/* Daily Overview Section */}
        <section className="mt-6 mb-8">
          <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-2xl text-primary-foreground mb-6 slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Bugungi kun</h2>
                <p className="text-primary-foreground/80">
                  {new Date().toLocaleDateString('uz-UZ', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <ProgressRing 
                progress={completionPercentage}
                className="text-primary-foreground"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" data-testid="text-completed-tasks">
                  {stats?.completedTasks || 0}
                </div>
                <div className="text-sm text-primary-foreground/80">Bajarildi</div>
              </div>
              <div>
                <div className="text-2xl font-bold" data-testid="text-total-tasks">
                  {todayTasks.length}
                </div>
                <div className="text-sm text-primary-foreground/80">Jami</div>
              </div>
              <div>
                <div className="text-2xl font-bold" data-testid="text-streak">
                  {stats?.currentStreak || 0}
                </div>
                <div className="text-sm text-primary-foreground/80">Ketma-ketlik</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => setTaskModalOpen(true)}
              data-testid="button-add-task"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Vazifa qo'shish</div>
                  <div className="text-xs text-muted-foreground">Yangi reja yarating</div>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => setGoalModalOpen(true)}
              data-testid="button-add-goal"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Maqsad belgilash</div>
                  <div className="text-xs text-muted-foreground">Yangi yo'l tanlang</div>
                </div>
              </div>
            </Button>
          </div>
        </section>

        {/* Today's Tasks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Bugungi vazifalar</h3>
            <Button variant="ghost" size="sm" data-testid="button-view-all-tasks">
              Barchasini ko'rish
            </Button>
          </div>
          
          {todayTasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Bugungi kun uchun vazifalar yo'q</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setTaskModalOpen(true)}
                  data-testid="button-add-first-task"
                >
                  Birinchi vazifani qo'shing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayTasks.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Active Goals */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Faol maqsadlar</h3>
            <Button variant="ghost" size="sm" data-testid="button-view-all-goals">
              Barchasini ko'rish
            </Button>
          </div>
          
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Faol maqsadlar yo'q</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setGoalModalOpen(true)}
                  data-testid="button-add-first-goal"
                >
                  Birinchi maqsadni belgilang
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeGoals.slice(0, 2).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </section>

        {/* Weekly Overview */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Haftalik ko'rinish</h3>
          <Card>
            <CardContent className="p-5">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 7 }, (_, i) => i - 3).map((offset) => {
                  const day = getDayOfWeek(offset);
                  return (
                    <div key={offset} className="text-center">
                      <div className={`text-xs mb-2 ${day.isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                        {day.name}
                      </div>
                      <div className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center ${
                        day.isToday 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {day.date}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Bu hafta: {stats?.weeklyCompletionRate || 0}% bajarilgan
                </div>
                <Button variant="ghost" size="sm" data-testid="button-view-calendar">
                  Kalendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Statistics Overview */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Statistika</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1" data-testid="text-weekly-completion">
                  {stats?.weeklyCompletionRate || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Haftalik bajarish</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1" data-testid="text-completed-goals">
                  {stats?.completedGoals || 0}
                </div>
                <div className="text-sm text-muted-foreground">Bajarilgan maqsadlar</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1" data-testid="text-current-streak">
                  {stats?.currentStreak || 0}
                </div>
                <div className="text-sm text-muted-foreground">Joriy ketma-ketlik</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-total-tasks-stat">
                  {stats?.totalTasks || 0}
                </div>
                <div className="text-sm text-muted-foreground">Jami vazifalar</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
        onClick={() => setTaskModalOpen(true)}
        data-testid="button-quick-add"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <BottomNavigation />
      
      <TaskModal 
        open={taskModalOpen} 
        onOpenChange={setTaskModalOpen}
        userId={currentUserId}
      />
      
      <GoalModal 
        open={goalModalOpen} 
        onOpenChange={setGoalModalOpen}
        userId={currentUserId}
      />
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
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
            {task.time && (
              <div className="text-sm text-muted-foreground">{task.time}</div>
            )}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'salomatlik': return 'bg-secondary/10 text-secondary';
      case 'talim': return 'bg-accent/10 text-accent';
      case 'kasbiy': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
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
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Jarayon</span>
            <span className="font-medium">
              {goal.currentValue}/{goal.targetValue} {goal.unit}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Tugash: {formatDate(goal.deadline)}
          </span>
          <Button variant="ghost" size="sm" data-testid={`button-update-goal-${goal.id}`}>
            Yangilash
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

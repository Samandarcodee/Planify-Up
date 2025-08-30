import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TaskModal } from "@/components/task-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/lib/user-service";
import { type Task } from "@shared/schema";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

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

  const { data: allTasks = [] } = useQuery<Task[]>({
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

  const navigateMonth = (direction: 'prev' | 'next') => {
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="px-4">
        <div className="flex items-center justify-between my-6">
          <h1 className="text-2xl font-bold text-foreground">Kalendar</h1>
          <Button onClick={() => setTaskModalOpen(true)} data-testid="button-add-task">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  data-testid="button-prev-month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  data-testid="button-next-month"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getMonthDays().map((day, index) => (
                <button
                  key={index}
                  className={`
                    relative p-2 rounded-lg text-sm transition-colors min-h-[40px]
                    ${day.isCurrentMonth 
                      ? 'text-foreground hover:bg-muted' 
                      : 'text-muted-foreground opacity-50'
                    }
                    ${day.isToday ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                    ${selectedDate === day.fullDate ? 'ring-2 ring-ring' : ''}
                  `}
                  onClick={() => setSelectedDate(day.fullDate)}
                  data-testid={`button-calendar-day-${day.fullDate}`}
                >
                  <span>{day.date}</span>
                  {day.tasks.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-secondary rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Tasks */}
        {selectedDate && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4">
                {new Date(selectedDate).toLocaleDateString('uz-UZ', { 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })} kunidagi vazifalar
              </h3>
              
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Bu kun uchun vazifalar yo'q</p>
                  <Button 
                    onClick={() => setTaskModalOpen(true)}
                    data-testid="button-add-task-for-date"
                  >
                    Vazifa qo'shing
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        task.completed ? 'bg-secondary' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <div className={`font-medium ${task.completed ? 'line-through opacity-70' : ''}`}>
                          {task.title}
                        </div>
                        {task.time && (
                          <div className="text-sm text-muted-foreground">{task.time}</div>
                        )}
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {task.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
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

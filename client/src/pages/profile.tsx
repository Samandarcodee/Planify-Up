import { useState, useEffect } from "react";
import { User, Settings, Trophy, TrendingUp, Calendar, Moon, Sun, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tgApp } from "@/lib/telegram";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";
import { type Achievement } from "@shared/schema";

export default function Profile() {
  const [currentUserId, setCurrentUserId] = useState<string>("demo-user");
  const telegramUser = tgApp.getUser();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (telegramUser) {
      setCurrentUserId(telegramUser.id.toString());
    }
  }, [telegramUser]);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats", currentUserId],
    enabled: !!currentUserId,
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements", currentUserId],
    enabled: !!currentUserId,
  });

  const displayName = telegramUser?.first_name || "Foydalanuvchi";
  const username = telegramUser?.username || "username";

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="px-4">
        {/* Profile Header */}
        <section className="mt-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1" data-testid="text-user-name">
                {displayName}
              </h2>
              <p className="text-muted-foreground mb-4" data-testid="text-username">
                @{username}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary" data-testid="text-profile-total-tasks">
                    {stats?.totalTasks || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Vazifalar</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-secondary" data-testid="text-profile-total-goals">
                    {stats?.totalGoals || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Maqsadlar</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent" data-testid="text-profile-achievements">
                    {achievements.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Yutuqlar</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Statistics */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Statistika</h3>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Umumiy ko'rsatkichlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bajarilgan vazifalar</span>
                  <span className="font-medium">{stats?.completedTasks || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bajarilgan maqsadlar</span>
                  <span className="font-medium">{stats?.completedGoals || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Haftalik bajarish</span>
                  <span className="font-medium">{stats?.weeklyCompletionRate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Joriy ketma-ketlik</span>
                  <span className="font-medium">{stats?.currentStreak || 0} kun</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Bu oyda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round((stats?.completedTasks || 0) / Math.max((stats?.totalTasks || 1), 1) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Bajarish darajasi</div>
                  <Progress 
                    value={(stats?.completedTasks || 0) / Math.max((stats?.totalTasks || 1), 1) * 100} 
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Achievements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">So'nggi yutuqlar</h3>
          
          {achievements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Hali yutuqlar yo'q</p>
                <p className="text-sm text-muted-foreground">
                  Vazifalarni bajaring va maqsadlarga erishing!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {achievements.slice(0, 5).map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center bounce-in">
                        <Trophy className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground" data-testid={`text-achievement-title-${achievement.id}`}>
                          {achievement.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(achievement.date).toLocaleDateString('uz-UZ')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Settings */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('profile.settings')}</h3>
          
          <div className="space-y-4">
            {/* Language Settings */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{t('profile.language')}</span>
                  </div>
                  <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uz">O'zbek</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Sun className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="font-medium">{t('profile.theme')}</span>
                  </div>
                  <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t('profile.light_mode')}</SelectItem>
                      <SelectItem value="dark">{t('profile.dark_mode')}</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Other Settings */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    data-testid="button-settings"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    {t('profile.settings')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    data-testid="button-logout"
                  >
                    {t('profile.logout')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}

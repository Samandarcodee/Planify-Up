import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { tgApp } from "./telegram";
const translations = {
    uz: {
        // Navigation
        "nav.home": "Bosh sahifa",
        "nav.tasks": "Vazifalar",
        "nav.goals": "Maqsadlar",
        "nav.calendar": "Kalendar",
        "nav.profile": "Profil",
        // Dashboard
        "dashboard.greeting": "Salom, {name}!",
        "dashboard.ready": "Bugungi kun uchun tayyor bo'lasizmi?",
        "dashboard.today": "Bugungi kun",
        "dashboard.completed": "Bajarildi",
        "dashboard.total": "Jami",
        "dashboard.streak": "Ketma-ketlik",
        "dashboard.add_task": "Vazifa qo'shish",
        "dashboard.add_goal": "Maqsad belgilash",
        "dashboard.today_tasks": "Bugungi vazifalar",
        "dashboard.no_tasks": "Bugungi kun uchun vazifalar yo'q",
        "dashboard.add_first_task": "Birinchi vazifani qo'shing",
        "dashboard.active_goals": "Faol maqsadlar",
        "dashboard.no_goals": "Faol maqsadlar yo'q",
        "dashboard.add_first_goal": "Birinchi maqsadni belgilang",
        "dashboard.weekly_view": "Haftalik ko'rinish",
        "dashboard.statistics": "Statistika",
        "dashboard.weekly_completion": "Haftalik bajarish",
        "dashboard.completed_goals": "Bajarilgan maqsadlar",
        "dashboard.current_streak": "Joriy ketma-ketlik",
        "dashboard.total_tasks": "Jami vazifalar",
        // Tasks
        "tasks.title": "Vazifalar",
        "tasks.all": "Barchasi",
        "tasks.work": "Ish",
        "tasks.health": "Salomatlik",
        "tasks.education": "Ta'lim",
        "tasks.personal": "Shaxsiy",
        "tasks.active": "Faol",
        "tasks.completed": "Bajarilgan",
        "tasks.no_active": "Faol vazifalar yo'q",
        "tasks.no_completed": "Hali hech qanday vazifa bajarilmagan",
        "tasks.add_task": "Vazifa qo'shing",
        // Goals
        "goals.title": "Maqsadlar",
        "goals.active": "Faol",
        "goals.completed": "Bajarilgan",
        "goals.no_active": "Faol maqsadlar yo'q",
        "goals.no_completed": "Hali hech qanday maqsad bajarilmagan",
        "goals.add_goal": "Maqsad belgilang",
        "goals.progress": "Jarayon",
        "goals.deadline": "Tugash",
        "goals.update": "Yangilash",
        // Profile
        "profile.statistics": "Statistika",
        "profile.tasks": "Vazifalar",
        "profile.goals": "Maqsadlar",
        "profile.achievements": "Yutuqlar",
        "profile.overall": "Umumiy ko'rsatkichlar",
        "profile.completed_tasks": "Bajarilgan vazifalar",
        "profile.completed_goals": "Bajarilgan maqsadlar",
        "profile.weekly_completion": "Haftalik bajarish",
        "profile.current_streak": "Joriy ketma-ketlik",
        "profile.this_month": "Bu oyda",
        "profile.completion_rate": "Bajarish darajasi",
        "profile.recent_achievements": "So'nggi yutuqlar",
        "profile.no_achievements": "Hali yutuqlar yo'q",
        "profile.achieve_message": "Vazifalarni bajaring va maqsadlarga erishing!",
        "profile.settings": "Sozlamalar",
        "profile.logout": "Chiqish",
        "profile.language": "Til",
        "profile.theme": "Mavzu",
        "profile.dark_mode": "Tungi rejim",
        "profile.light_mode": "Kunduzgi rejim",
        // Forms
        "form.task_title": "Vazifa nomi",
        "form.task_title_placeholder": "Vazifa nomini kiriting...",
        "form.category": "Kategoriya",
        "form.category_placeholder": "Kategoriya tanlang",
        "form.time": "Vaqt",
        "form.date": "Sana",
        "form.cancel": "Bekor qilish",
        "form.save": "Saqlash",
        "form.create": "Yaratish",
        "form.goal_title": "Maqsad nomi",
        "form.goal_title_placeholder": "Maqsad nomini kiriting...",
        "form.description": "Tavsif",
        "form.description_placeholder": "Maqsad haqida batafsil...",
        "form.target_value": "Maqsad qiymati",
        "form.unit": "Birlik",
        "form.unit_placeholder": "kun, dars, kitob...",
        "form.deadline": "Tugash sanasi",
        // Categories
        "category.work": "Ish",
        "category.health": "Salomatlik",
        "category.education": "Ta'lim",
        "category.personal": "Shaxsiy",
        "category.career": "Kasbiy rivojlanish",
        "category.financial": "Moliyaviy",
        // Common
        "common.loading": "Yuklanmoqda...",
        "common.add": "Qo'shish",
        "common.edit": "Tahrirlash",
        "common.delete": "O'chirish",
        "common.view_all": "Barchasini ko'rish",
        "common.success": "Muvaffaqiyat!",
        "common.error": "Xatolik!",
        "common.days": "kun",
        "common.day": "kun",
        "common.week": "hafta",
        "common.month": "oy",
        "common.year": "yil",
        "common.user": "Foydalanuvchi",
        // Additional translations
        "profile.motivation": "Vazifalarni bajaring va maqsadlarga erishing!",
        "profile.system_mode": "Sistema",
        "goals.updated_success": "Maqsad yangilandi",
        "goals.updated_error": "Maqsad yangilanmadi",
        "goals.deleted_success": "Maqsad o'chirildi",
        "goals.deleted_error": "Maqsad o'chirilmadi",
        "tasks.updated_error": "Vazifa yangilanmadi",
        "tasks.deleted_success": "Vazifa o'chirildi",
        "tasks.deleted_error": "Vazifa o'chirilmadi",
        // Dashboard additional
        "dashboard.add_task_desc": "Yangi reja",
        "dashboard.add_goal_desc": "Yangi yo'l",
    },
    ru: {
        // Navigation
        "nav.home": "Главная",
        "nav.tasks": "Задачи",
        "nav.goals": "Цели",
        "nav.calendar": "Календарь",
        "nav.profile": "Профиль",
        // Dashboard
        "dashboard.greeting": "Привет, {name}!",
        "dashboard.ready": "Готовы к сегодняшнему дню?",
        "dashboard.today": "Сегодня",
        "dashboard.completed": "Выполнено",
        "dashboard.total": "Всего",
        "dashboard.streak": "Серия",
        "dashboard.add_task": "Добавить задачу",
        "dashboard.add_goal": "Поставить цель",
        "dashboard.today_tasks": "Сегодняшние задачи",
        "dashboard.no_tasks": "На сегодня задач нет",
        "dashboard.add_first_task": "Добавьте первую задачу",
        "dashboard.active_goals": "Активные цели",
        "dashboard.no_goals": "Активных целей нет",
        "dashboard.add_first_goal": "Поставьте первую цель",
        "dashboard.weekly_view": "Недельный обзор",
        "dashboard.statistics": "Статистика",
        "dashboard.weekly_completion": "Недельное выполнение",
        "dashboard.completed_goals": "Выполненные цели",
        "dashboard.current_streak": "Текущая серия",
        "dashboard.total_tasks": "Всего задач",
        // Tasks
        "tasks.title": "Задачи",
        "tasks.all": "Все",
        "tasks.work": "Работа",
        "tasks.health": "Здоровье",
        "tasks.education": "Образование",
        "tasks.personal": "Личное",
        "tasks.active": "Активные",
        "tasks.completed": "Выполненные",
        "tasks.no_active": "Активных задач нет",
        "tasks.no_completed": "Пока не выполнена ни одна задача",
        "tasks.add_task": "Добавить задачу",
        // Goals
        "goals.title": "Цели",
        "goals.active": "Активные",
        "goals.completed": "Выполненные",
        "goals.no_active": "Активных целей нет",
        "goals.no_completed": "Пока не выполнена ни одна цель",
        "goals.add_goal": "Поставить цель",
        "goals.progress": "Прогресс",
        "goals.deadline": "Дедлайн",
        "goals.update": "Обновить",
        // Profile
        "profile.statistics": "Статистика",
        "profile.tasks": "Задачи",
        "profile.goals": "Цели",
        "profile.achievements": "Достижения",
        "profile.overall": "Общие показатели",
        "profile.completed_tasks": "Выполненные задачи",
        "profile.completed_goals": "Выполненные цели",
        "profile.weekly_completion": "Недельное выполнение",
        "profile.current_streak": "Текущая серия",
        "profile.this_month": "В этом месяце",
        "profile.completion_rate": "Уровень выполнения",
        "profile.recent_achievements": "Последние достижения",
        "profile.no_achievements": "Достижений пока нет",
        "profile.achieve_message": "Выполняйте задачи и достигайте целей!",
        "profile.settings": "Настройки",
        "profile.logout": "Выйти",
        "profile.language": "Язык",
        "profile.theme": "Тема",
        "profile.dark_mode": "Темная тема",
        "profile.light_mode": "Светлая тема",
        // Forms
        "form.task_title": "Название задачи",
        "form.task_title_placeholder": "Введите название задачи...",
        "form.category": "Категория",
        "form.category_placeholder": "Выберите категорию",
        "form.time": "Время",
        "form.date": "Дата",
        "form.cancel": "Отмена",
        "form.save": "Сохранить",
        "form.create": "Создать",
        "form.goal_title": "Название цели",
        "form.goal_title_placeholder": "Введите название цели...",
        "form.description": "Описание",
        "form.description_placeholder": "Подробнее о цели...",
        "form.target_value": "Целевое значение",
        "form.unit": "Единица",
        "form.unit_placeholder": "дни, уроки, книги...",
        "form.deadline": "Дата окончания",
        // Categories
        "category.work": "Работа",
        "category.health": "Здоровье",
        "category.education": "Образование",
        "category.personal": "Личное",
        "category.career": "Карьерное развитие",
        "category.financial": "Финансовое",
        // Common
        "common.loading": "Загрузка...",
        "common.add": "Добавить",
        "common.edit": "Редактировать",
        "common.delete": "Удалить",
        "common.view_all": "Посмотреть все",
        "common.success": "Успех!",
        "common.error": "Ошибка!",
        "common.days": "дни",
        "common.day": "день",
        "common.week": "неделя",
        "common.month": "месяц",
        "common.year": "год",
        "common.user": "Пользователь",
        // Additional translations  
        "profile.motivation": "Выполняйте задачи и достигайте целей!",
        "profile.system_mode": "Система",
        "goals.updated_success": "Цель обновлена",
        "goals.updated_error": "Цель не обновлена",
        "goals.deleted_success": "Цель удалена",
        "goals.deleted_error": "Цель не удалена",
        "tasks.updated_error": "Задача не обновлена",
        "tasks.deleted_success": "Задача удалена",
        "tasks.deleted_error": "Задача не удалена",
        // Dashboard additional
        "dashboard.add_task_desc": "Новый план",
        "dashboard.add_goal_desc": "Новый путь",
    },
    en: {
        // Navigation
        "nav.home": "Home",
        "nav.tasks": "Tasks",
        "nav.goals": "Goals",
        "nav.calendar": "Calendar",
        "nav.profile": "Profile",
        // Dashboard
        "dashboard.greeting": "Hello, {name}!",
        "dashboard.ready": "Ready for today?",
        "dashboard.today": "Today",
        "dashboard.completed": "Completed",
        "dashboard.total": "Total",
        "dashboard.streak": "Streak",
        "dashboard.add_task": "Add Task",
        "dashboard.add_goal": "Set Goal",
        "dashboard.today_tasks": "Today's Tasks",
        "dashboard.no_tasks": "No tasks for today",
        "dashboard.add_first_task": "Add your first task",
        "dashboard.active_goals": "Active Goals",
        "dashboard.no_goals": "No active goals",
        "dashboard.add_first_goal": "Set your first goal",
        "dashboard.weekly_view": "Weekly View",
        "dashboard.statistics": "Statistics",
        "dashboard.weekly_completion": "Weekly Completion",
        "dashboard.completed_goals": "Completed Goals",
        "dashboard.current_streak": "Current Streak",
        "dashboard.total_tasks": "Total Tasks",
        // Tasks
        "tasks.title": "Tasks",
        "tasks.all": "All",
        "tasks.work": "Work",
        "tasks.health": "Health",
        "tasks.education": "Education",
        "tasks.personal": "Personal",
        "tasks.active": "Active",
        "tasks.completed": "Completed",
        "tasks.no_active": "No active tasks",
        "tasks.no_completed": "No tasks completed yet",
        "tasks.add_task": "Add Task",
        // Goals
        "goals.title": "Goals",
        "goals.active": "Active",
        "goals.completed": "Completed",
        "goals.no_active": "No active goals",
        "goals.no_completed": "No goals completed yet",
        "goals.add_goal": "Set Goal",
        "goals.progress": "Progress",
        "goals.deadline": "Deadline",
        "goals.update": "Update",
        // Profile
        "profile.statistics": "Statistics",
        "profile.tasks": "Tasks",
        "profile.goals": "Goals",
        "profile.achievements": "Achievements",
        "profile.overall": "Overall Statistics",
        "profile.completed_tasks": "Completed Tasks",
        "profile.completed_goals": "Completed Goals",
        "profile.weekly_completion": "Weekly Completion",
        "profile.current_streak": "Current Streak",
        "profile.this_month": "This Month",
        "profile.completion_rate": "Completion Rate",
        "profile.recent_achievements": "Recent Achievements",
        "profile.no_achievements": "No achievements yet",
        "profile.achieve_message": "Complete tasks and reach your goals!",
        "profile.settings": "Settings",
        "profile.logout": "Logout",
        "profile.language": "Language",
        "profile.theme": "Theme",
        "profile.dark_mode": "Dark Mode",
        "profile.light_mode": "Light Mode",
        // Forms
        "form.task_title": "Task Title",
        "form.task_title_placeholder": "Enter task title...",
        "form.category": "Category",
        "form.category_placeholder": "Select category",
        "form.time": "Time",
        "form.date": "Date",
        "form.cancel": "Cancel",
        "form.save": "Save",
        "form.create": "Create",
        "form.goal_title": "Goal Title",
        "form.goal_title_placeholder": "Enter goal title...",
        "form.description": "Description",
        "form.description_placeholder": "Goal details...",
        "form.target_value": "Target Value",
        "form.unit": "Unit",
        "form.unit_placeholder": "days, lessons, books...",
        "form.deadline": "Deadline",
        // Categories
        "category.work": "Work",
        "category.health": "Health",
        "category.education": "Education",
        "category.personal": "Personal",
        "category.career": "Career Development",
        "category.financial": "Financial",
        // Common
        "common.loading": "Loading...",
        "common.add": "Add",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.view_all": "View All",
        "common.success": "Success!",
        "common.error": "Error!",
        "common.days": "days",
        "common.day": "day",
        "common.week": "week",
        "common.month": "month",
        "common.year": "year",
        "common.user": "User",
        // Additional translations
        "profile.motivation": "Complete tasks and achieve your goals!",
        "profile.system_mode": "System",
        "goals.updated_success": "Goal updated",
        "goals.updated_error": "Goal not updated",
        "goals.deleted_success": "Goal deleted",
        "goals.deleted_error": "Goal not deleted",
        "tasks.updated_error": "Task not updated",
        "tasks.deleted_success": "Task deleted",
        "tasks.deleted_error": "Task not deleted",
        // Dashboard additional  
        "dashboard.add_task_desc": "New plan",
        "dashboard.add_goal_desc": "New path",
    }
};
const LanguageContext = createContext(undefined);
export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        // Try to get from localStorage first
        const stored = localStorage.getItem('language');
        if (stored && ['uz', 'ru', 'en'].includes(stored)) {
            return stored;
        }
        // Auto-detect from Telegram
        const tgUser = tgApp.getUser();
        if (tgUser?.language_code) {
            if (tgUser.language_code.startsWith('ru'))
                return 'ru';
            if (tgUser.language_code.startsWith('en'))
                return 'en';
            if (tgUser.language_code.startsWith('uz'))
                return 'uz';
        }
        // Default to Uzbek
        return 'uz';
    });
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);
    const t = (key, params) => {
        // Get the correct translation object for the current language
        const langTranslations = translations[language];
        // Use simple key lookup - no nested keys for now to fix the issue
        let value = langTranslations[key];
        if (typeof value !== 'string') {
            // Fallback to uz if translation not found
            value = translations.uz[key];
            if (typeof value !== 'string') {
                return key; // Return key if no translation found
            }
        }
        let result = value;
        // Replace parameters like {name}
        if (params) {
            Object.entries(params).forEach(([param, val]) => {
                result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), val);
            });
        }
        return result;
    };
    return (_jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children: children }));
}
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

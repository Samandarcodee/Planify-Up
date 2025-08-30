import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const taskCategories = [
  { value: "ish", label: "Ish" },
  { value: "salomatlik", label: "Salomatlik" },
  { value: "talim", label: "Ta'lim" },
  { value: "shaxsiy", label: "Shaxsiy" },
];

export function TaskModal({ open, onOpenChange, userId }: TaskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertTask>({
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
    mutationFn: async (data: InsertTask) => {
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

  const onSubmit = (data: InsertTask) => {
    createTaskMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-t-2xl border-0 bg-card">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Yangi vazifa qo'shish</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vazifa nomi</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Vazifa nomini kiriting..." 
                      {...field}
                      data-testid="input-task-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoriya</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-task-category">
                        <SelectValue placeholder="Kategoriya tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vaqt</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field}
                        value={field.value || ''}
                        data-testid="input-task-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sana</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        data-testid="input-task-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-task"
              >
                Bekor qilish
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createTaskMutation.isPending}
                data-testid="button-submit-task"
              >
                {createTaskMutation.isPending ? "Qo'shilmoqda..." : "Qo'shish"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

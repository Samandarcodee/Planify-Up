import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertGoalSchema, type InsertGoal } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const goalCategories = [
  { value: "salomatlik", label: "Salomatlik" },
  { value: "talim", label: "Ta'lim" },
  { value: "kasbiy", label: "Kasbiy rivojlanish" },
  { value: "moliyaviy", label: "Moliyaviy" },
  { value: "shaxsiy", label: "Shaxsiy" },
];

export function GoalModal({ open, onOpenChange, userId }: GoalModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertGoal>({
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
    mutationFn: async (data: InsertGoal) => {
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

  const onSubmit = (data: InsertGoal) => {
    createGoalMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-t-2xl border-0 bg-card">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Yangi maqsad belgilash</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maqsad nomi</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Maqsad nomini kiriting..." 
                      {...field}
                      data-testid="input-goal-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Maqsad haqida batafsil..." 
                      rows={3}
                      {...field}
                      value={field.value || ''}
                      data-testid="textarea-goal-description"
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
                      <SelectTrigger data-testid="select-goal-category">
                        <SelectValue placeholder="Kategoriya tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {goalCategories.map((category) => (
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
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maqsad qiymati</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-goal-target"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birlik</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="kun, dars, kitob..." 
                        {...field}
                        data-testid="input-goal-unit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tugash sanasi</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      data-testid="input-goal-deadline"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-goal"
              >
                Bekor qilish
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createGoalMutation.isPending}
                data-testid="button-submit-goal"
              >
                {createGoalMutation.isPending ? "Yaratilmoqda..." : "Yaratish"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

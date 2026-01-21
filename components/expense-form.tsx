"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Expense, CATEGORIES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCategoryIcon } from "@/lib/utils";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0"
    ),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expense: Omit<Expense, "id" | "createdAt">) => void;
  initialData?: Expense;
  selectedDate: Date;
}

export function ExpenseForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  selectedDate,
}: ExpenseFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData?.amount.toString() || "",
      category: initialData?.category || "Food",
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setValue("amount", initialData.amount.toString());
        setValue("category", initialData.category);
        setValue("description", initialData.description);
      } else {
        reset({
          amount: "",
          category: "Food",
          description: "",
        });
      }
    }
  }, [initialData, open, reset, setValue]);

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || "",
      date: selectedDate.toISOString(),
    });
    
    // Reset handled by effect when reopening, but good to reset on success too if needed
    // However, onOpenChange(false) will hide it, and next open will reset.
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the details of your expense"
              : "Track your spending by adding a new expense"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₱)</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />
              )}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-4 gap-2">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => field.onChange(cat)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          field.value === cat
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-2xl">{getCategoryIcon(cat)}</span>
                        <span className="text-xs font-medium">{cat}</span>
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="description"
                  type="text"
                  placeholder="e.g., Lunch at restaurant"
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {initialData ? "Update" : "Add"} Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

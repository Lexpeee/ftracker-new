"use client";

import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Trash2, Plus } from "lucide-react";

const subItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0"
    ),
});

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
  subItems: z.array(subItemSchema).optional(),
}).superRefine((data, ctx) => {
  if (data.subItems && data.subItems.length > 0) {
    const totalAmount = parseFloat(data.amount);
    const subItemsTotal = data.subItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    
    // Allow for small floating point differences
    if (Math.abs(totalAmount - subItemsTotal) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Sub-items total (${subItemsTotal.toFixed(2)}) must match expense amount (${totalAmount.toFixed(2)})`,
        path: ["subItems"],
      });
    }
  }
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
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData?.amount.toString() || "",
      category: initialData?.category || "Food",
      description: initialData?.description || "",
      subItems: initialData?.subItems?.map(item => ({
        name: item.name,
        amount: item.amount.toString()
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subItems",
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setValue("amount", initialData.amount.toString());
        setValue("category", initialData.category);
        setValue("description", initialData.description);
        setValue("subItems", initialData.subItems?.map(item => ({
          name: item.name,
          amount: item.amount.toString()
        })) || []);
      } else {
        reset({
          amount: "",
          category: "Food",
          description: "",
          subItems: [],
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
      subItems: data.subItems?.map(item => ({
        id: crypto.randomUUID(),
        name: item.name || "",
        amount: parseFloat(item.amount)
      })),
    });

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

          {selectedCategory === 'Shopping' && 
            <div 
              className="space-y-4 border-t pt-4"
            >
              <div className="flex items-center justify-between">
                <Label>Sub-items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", amount: "" })}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>

              <div 
                className="space-y-2"
                style={{
                  height: '100%',
                  maxHeight: 200,
                  overflowY: 'auto'
                }}
              >
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Controller
                        name={`subItems.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Item name"
                            className="h-9"
                          />
                        )}
                      />
                    </div>
                    <div className="w-24">
                      <Controller
                        name={`subItems.${index}.amount`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="h-9"
                          />
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive/80"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {fields.length > 0 && (
                <div className="flex justify-end text-sm">
                  <span className={
                    Math.abs(parseFloat(watch("amount") || "0") - fields.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)) < 0.01
                      ? "text-muted-foreground"
                      : "text-destructive font-medium"
                  }>
                    Total: {fields.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)} / {parseFloat(watch("amount") || "0").toFixed(2)}
                  </span>
                </div>
              )}
              
              {errors.subItems && (
                <p className="text-sm text-destructive">{errors.subItems.message}</p>
              )}
            </div>
          }

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

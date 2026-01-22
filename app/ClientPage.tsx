"use client";

import { useState, useEffect } from "react";
import { Plus, List } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AllExpenses } from "@/components/all-expenses";
import { DateSelector } from "@/components/date-selector";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseForm } from "@/components/expense-form";
import { MetricsDashboard } from "@/components/metrics-dashboard";
import { Button } from "@/components/ui/button";
import { Expense } from "@/lib/types";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpensesByDate,
  getExpensesByMonth,
} from "@/lib/storage";

export default function ClientPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<Expense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [activeTab, setActiveTab] = useState<"overview" | "all-expenses">("overview");

  // Load expenses on mount
  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  // Update filtered expenses when date or expenses change
  useEffect(() => {
    setDailyExpenses(getExpensesByDate(selectedDate));
    setMonthlyExpenses(
      getExpensesByMonth(selectedDate.getFullYear(), selectedDate.getMonth())
    );
  }, [selectedDate, expenses]);

  const handleAddExpense = (expenseData: Omit<Expense, "id" | "createdAt">) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      setEditingExpense(undefined);
    } else {
      addExpense(expenseData);
    }
    setExpenses(getExpenses());
    setIsFormOpen(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
      setExpenses(getExpenses());
    }
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingExpense(undefined);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* Date Selector */}
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

        {/* Metrics Dashboard */}
        <MetricsDashboard
          dailyExpenses={dailyExpenses}
          monthlyExpenses={monthlyExpenses}
        />

        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeTab === "overview"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:bg-background/[0.12] hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("all-expenses")}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeTab === "all-expenses"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:bg-background/[0.12] hover:text-foreground"
            }`}
          >
            All Expenses
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Today's Expenses
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({dailyExpenses.length})
                </span>
              </h2>
              <Button 
                onClick={() => setIsFormOpen(true)}
                variant="gradient"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>

            <ExpenseList
              expenses={dailyExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        ) : (
          <AllExpenses />
        )}

        {/* Expense Form Dialog */}
        <ExpenseForm
          open={isFormOpen}
          onOpenChange={handleFormClose}
          onSubmit={handleAddExpense}
          initialData={editingExpense}
          selectedDate={selectedDate}
        />
      </div>
    </main>
  );
}

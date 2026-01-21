"use client";

import { Expense } from "@/lib/types";
import { formatCurrency, getCategoryColor, getCategoryIcon } from "@/lib/utils";
import { Trash2, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
        <p className="text-sm text-muted-foreground text-center">
          Add your first expense to start tracking your spending
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense, index) => (
        <Card
          key={expense.id}
          className="p-4 hover:shadow-md transition-all duration-200 animate-fade-in glass-effect border-white/10"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${getCategoryColor(
                expense.category
              )} flex items-center justify-center text-2xl flex-shrink-0`}
            >
              {getCategoryIcon(expense.category)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">
                {expense.description || expense.category}
              </h4>
              <p className="text-xs text-muted-foreground">{expense.category}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-bold text-gradient">
                  {formatCurrency(expense.amount)}
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  aria-label="Edit expense"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-all duration-200 text-red-500"
                  aria-label="Delete expense"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

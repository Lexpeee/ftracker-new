"use client";

import { Expense } from "@/lib/types";
import { formatCurrency, getCategoryColor, getCategoryIcon } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Calendar } from "lucide-react";

interface MetricsDashboardProps {
  dailyExpenses: Expense[];
  monthlyExpenses: Expense[];
}

export function MetricsDashboard({
  dailyExpenses,
  monthlyExpenses,
}: MetricsDashboardProps) {
  const dailyTotal = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const dailyAverage = monthlyExpenses.length > 0
    ? monthlyTotal / new Date().getDate()
    : 0;

  // Calculate category breakdown for monthly expenses
  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Total</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              {formatCurrency(dailyTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dailyExpenses.length} transaction{dailyExpenses.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              {formatCurrency(monthlyTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyExpenses.length} transaction{monthlyExpenses.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              {formatCurrency(dailyAverage)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {sortedCategories.length > 0 && (
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Top Categories This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedCategories.map(([category, amount]) => {
              const percentage = (amount / monthlyTotal) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(category)}</span>
                      <span className="font-medium">{category}</span>
                    </div>
                    <span className="font-semibold text-gradient">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColor(category)} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of monthly spending
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

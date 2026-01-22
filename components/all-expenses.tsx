"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expense } from "@/lib/types";
import { getExpenses } from "@/lib/storage";
import { format } from "date-fns";

type SortKey = keyof Expense;
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export function AllExpenses() {
  const [data, setData] = useState<Expense[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });

  useEffect(() => {
    // Initial load
    const expenses = getExpenses();
    setData(sortData(expenses, "date", "desc"));
  }, []);

  const sortData = (
    items: Expense[],
    key: SortKey,
    direction: SortDirection
  ): Expense[] => {
    return [...items].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setData(sortData(data, key, direction));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Date: format(new Date(item.date), "yyyy-MM-dd"),
        Description: item.description,
        Category: item.category,
        Amount: item.amount,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "expenses.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Date: format(new Date(item.date), "yyyy-MM-dd"),
        Description: item.description,
        Category: item.category,
        Amount: item.amount,
      }))
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "expenses.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold p-0">All Expenses</h2>
          <p className="text-sm text-muted-foreground">
            View and manage your expense history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="gradient" size="sm" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border glass-effect border-white/10">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("date")}
                    className="hover:bg-transparent px-0 font-medium text-muted-foreground"
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("description")}
                    className="hover:bg-transparent px-0 font-medium text-muted-foreground"
                  >
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("category")}
                    className="hover:bg-transparent px-0 font-medium text-muted-foreground"
                  >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("amount")}
                    className="hover:bg-transparent px-0 font-medium text-muted-foreground ml-auto"
                  >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      {format(new Date(item.date), "PPP")}
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      {item.description}
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 capitalize">
                      {item.category.replace("-", " ")}
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right font-medium">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="h-24 text-center">
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

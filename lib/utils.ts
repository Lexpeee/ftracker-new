import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    food: 'bg-orange-500',
    transport: 'bg-pink-500',
    shopping: 'bg-purple-500',
    entertainment: 'bg-blue-500',
    bills: 'bg-yellow-500',
    health: 'bg-green-500',
    other: 'bg-gray-500',
  };
  return colors[category.toLowerCase()] || colors.other;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    shopping: '🛍️',
    entertainment: '🎮',
    bills: '💡',
    health: '💊',
    other: '📝',
  };
  return icons[category.toLowerCase()] || icons.other;
}

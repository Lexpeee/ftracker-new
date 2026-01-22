export interface SubItem {
  id: string;
  name: string;
  amount: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string
  subItems?: SubItem[];
  createdAt: string;
}

export type Category = 
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Health'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Other',
];

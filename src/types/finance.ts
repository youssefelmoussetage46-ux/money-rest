// Financial data types for Money Reset application

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string; // ISO date string
  description: string;
}

export interface Income extends Transaction {
  type: 'income';
  source: string;
}

export interface Expense extends Transaction {
  type: 'expense';
  category: string; // Food, Transport, Bills, Shopping, Entertainment, Health, Other
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  totalSavings: number;
  savingsRate: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
import { create } from 'zustand';
import type { Transaction, BudgetCategory, SavingsGoal, Debt, DashboardStats } from '../types/finance';
import { v4 as uuidv4 } from 'uuid';
import { startOfMonth, endOfMonth } from 'date-fns';

// Demo data (matches original demo data)
const demoTransactions: Transaction[] = [
  { id: '1', description: 'Salary', amount: 3500, type: 'income', category: 'Salary', date: '2026-09-01' },
  { id: '2', description: 'Freelance Project', amount: 1200, type: 'income', category: 'Freelance', date: '2026-09-05' },
  { id: '3', description: 'Grocery Shopping', amount: 150, type: 'expense', category: 'Food', date: '2026-09-02' },
  { id: '4', description: 'Gasoline', amount: 60, type: 'expense', category: 'Transport', date: '2026-09-03' },
  { id: '5', description: 'Internet Bill', amount: 75, type: 'expense', category: 'Bills', date: '2026-09-04' },
  { id: '6', description: 'Netflix Subscription', amount: 15, type: 'expense', category: 'Entertainment', date: '2026-09-05' },
  { id: '7', description: 'Restaurant Dinner', amount: 85, type: 'expense', category: 'Food', date: '2026-09-06' },
  { id: '8', description: 'Movie Tickets', amount: 30, type: 'expense', category: 'Entertainment', date: '2026-09-07' },
  { id: '9', description: 'Pharmacy', amount: 25, type: 'expense', category: 'Health', date: '2026-09-08' },
  { id: '10', description: 'New Shirt', amount: 45, type: 'expense', category: 'Shopping', date: '2026-09-09' }
];

const demoBudgetCategories: BudgetCategory[] = [
  { id: 'food', name: 'Food', budgetedAmount: 500, spentAmount: 230 },
  { id: 'transport', name: 'Transport', budgetedAmount: 300, spentAmount: 60 },
  { id: 'bills', name: 'Bills', budgetedAmount: 800, spentAmount: 75 },
  { id: 'shopping', name: 'Shopping', budgetedAmount: 200, spentAmount: 45 },
  { id: 'entertainment', name: 'Entertainment', budgetedAmount: 150, spentAmount: 45 },
  { id: 'health', name: 'Health', budgetedAmount: 100, spentAmount: 25 },
  { id: 'other', name: 'Other', budgetedAmount: 100, spentAmount: 0 }
];

const demoSavingsGoals: SavingsGoal[] = [
  { id: 'emergency-fund', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1500, deadline: '2026-12-31' },
  { id: 'vacation', name: 'Vacation', targetAmount: 3000, currentAmount: 750, deadline: '2027-06-30' },
  { id: 'home-downpayment', name: 'Home Downpayment', targetAmount: 20000, currentAmount: 5000, deadline: '2028-12-31' }
];

const demoDebts: Debt[] = [
  { id: 'credit-card', name: 'Credit Card Debt', totalAmount: 2500, paidAmount: 500 },
  { id: 'student-loan', name: 'Student Loan', totalAmount: 15000, paidAmount: 3000 },
  { id: 'car-loan', name: 'Car Loan', totalAmount: 10000, paidAmount: 2000 }
];

interface FinanceState {
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  debts: Debt[];
  theme: 'light' | 'dark';
  currency: string;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budget category actions
  addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (id: string) => void;

  // Savings goal actions
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;

  // Debt actions
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;

  // UI actions
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrency: (currency: string) => void;

  // Computed values
  getDashboardStats: () => DashboardStats;
  getMonthlyIncome: (year: number, month: number) => number;
  getMonthlyExpenses: (year: number, month: number) => number;
  getExpensesByCategory: (year: number, month: number) => Record<string, number>;
}

export const useDemoFinanceStore = create<FinanceState>((set, get) => ({
  // Initial demo data
  transactions: demoTransactions,
  budgetCategories: demoBudgetCategories,
  savingsGoals: demoSavingsGoals,
  debts: demoDebts,
  theme: 'light',
  currency: 'USD',

  // Transaction actions (in-memory only)
  addTransaction: (transaction) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    set(state => ({
      transactions: [...state.transactions, newTransaction]
    }));
  },

  updateTransaction: (id, updates) => {
    set(state => ({
      transactions: state.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  },

  deleteTransaction: (id) => {
    set(state => ({
      transactions: state.transactions.filter(t => t.id !== id)
    }));
  },

  // Budget category actions
  addBudgetCategory: (category) => {
    const newCategory = { ...category, id: uuidv4() };
    set(state => ({
      budgetCategories: [...state.budgetCategories, newCategory]
    }));
  },

  updateBudgetCategory: (id, updates) => {
    set(state => ({
      budgetCategories: state.budgetCategories.map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  },

  deleteBudgetCategory: (id) => {
    set(state => ({
      budgetCategories: state.budgetCategories.filter(c => c.id !== id)
    }));
  },

  // Savings goal actions
  addSavingsGoal: (goal) => {
    const newGoal = { ...goal, id: uuidv4() };
    set(state => ({
      savingsGoals: [...state.savingsGoals, newGoal]
    }));
  },

  updateSavingsGoal: (id, updates) => {
    set(state => ({
      savingsGoals: state.savingsGoals.map(g =>
        g.id === id ? { ...g, ...updates } : g
      )
    }));
  },

  deleteSavingsGoal: (id) => {
    set(state => ({
      savingsGoals: state.savingsGoals.filter(g => g.id !== id)
    })); 
  },

  // Debt actions
  addDebt: (debt) => {
    const newDebt = { ...debt, id: uuidv4() };
    set(state => ({
      debts: [...state.debts, newDebt]
    }));
  },

  updateDebt: (id, updates) => {
    set(state => ({
      debts: state.debts.map(d =>
        d.id === id ? { ...d, ...updates } : d
      )
    }));
  },

  deleteDebt: (id) => {
    set(state => ({
      debts: state.debts.filter(d => d.id !== id)
    }));
  },
setTheme: (theme) => { 
  set(() => ({ 
    theme 
  })); 
},

setCurrency: (currency) => { 
  set(() => ({ 
    currency 
  })); 
},
// UI actions (in-memory only)

  // Computed values
  getDashboardStats: () => {
    const state = get();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalIncome - totalExpenses;

    const totalSavings = state.savingsGoals
      .reduce((sum, goal) => sum + goal.currentAmount, 0);

    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    const monthlyIncome = state.getMonthlyIncome(currentYear, currentMonth);
    const monthlyExpenses = state.getMonthlyExpenses(currentYear, currentMonth);

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
      totalSavings,
      savingsRate: Number.isNaN(savingsRate) ? 0 : savingsRate,
      monthlyIncome,
      monthlyExpenses
    };
  },

  getMonthlyIncome: (year, month) => {
    const state = get();
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));

    return state.transactions
      .filter(t => t.type === 'income' &&
                   new Date(t.date) >= start &&
                   new Date(t.date) <= end)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getMonthlyExpenses: (year, month) => {
    const state = get();
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));

    return state.transactions
      .filter(t => t.type === 'expense' &&
                   new Date(t.date) >= start &&
                   new Date(t.date) <= end)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getExpensesByCategory: (year, month) => {
    const state = get();
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));

    const expenses = state.transactions
      .filter(t => t.type === 'expense' &&
                   new Date(t.date) >= start &&
                   new Date(t.date) <= end);

    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }
}));
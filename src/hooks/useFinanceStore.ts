import { create } from 'zustand';
import type { Transaction, BudgetCategory, SavingsGoal, Debt, DashboardStats } from '../types/finance';
import { v4 as uuidv4 } from 'uuid';
import { startOfMonth, endOfMonth } from 'date-fns';

// Helper function to load data from localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initial data
const initialTransactions: Transaction[] = loadFromStorage('money-reset-transactions', []);
const initialBudgetCategories: BudgetCategory[] = loadFromStorage('money-reset-budget', [
  { id: 'food', name: 'Food', budgetedAmount: 500, spentAmount: 0 },
  { id: 'transport', name: 'Transport', budgetedAmount: 300, spentAmount: 0 },
  { id: 'bills', name: 'Bills', budgetedAmount: 800, spentAmount: 0 },
  { id: 'shopping', name: 'Shopping', budgetedAmount: 200, spentAmount: 0 },
  { id: 'entertainment', name: 'Entertainment', budgetedAmount: 150, spentAmount: 0 },
  { id: 'health', name: 'Health', budgetedAmount: 100, spentAmount: 0 },
  { id: 'other', name: 'Other', budgetedAmount: 100, spentAmount: 0 }
]);
const initialSavingsGoals: SavingsGoal[] = loadFromStorage('money-reset-savings', [
  { id: 'emergency-fund', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1500, deadline: '2026-12-31' },
  { id: 'vacation', name: 'Vacation', targetAmount: 3000, currentAmount: 750, deadline: '2027-06-30' }
]);
const initialDebts: Debt[] = loadFromStorage('money-reset-debts', [
  { id: 'credit-card', name: 'Credit Card Debt', totalAmount: 2500, paidAmount: 500 },
  { id: 'student-loan', name: 'Student Loan', totalAmount: 15000, paidAmount: 3000 }
]);

// Theme and currency initial values
const initialTheme: 'light' | 'dark' = loadFromStorage('money-reset-theme', 'light');
const initialCurrency: string = loadFromStorage('money-reset-currency', 'USD');

interface FinanceState {
  // Data
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  debts: Debt[];
  // UI state
  theme: 'light' | 'dark';
  currency: string;

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (id: string) => void;

  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;

  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;

  // Setter actions for demo data
  setTransactions: (transactions: Transaction[]) => void;
  setBudgetCategories: (categories: BudgetCategory[]) => void;
  setSavingsGoals: (goals: SavingsGoal[]) => void;
  setDebts: (debts: Debt[]) => void;

  // UI actions
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrency: (currency: string) => void;

  // Computed values
  getDashboardStats: () => DashboardStats;
  getMonthlyIncome: (year: number, month: number) => number;
  getMonthlyExpenses: (year: number, month: number) => number;
  getExpensesByCategory: (year: number, month: number) => Record<string, number>;
}

// Create the store
export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial data
  transactions: initialTransactions,
  budgetCategories: initialBudgetCategories,
  savingsGoals: initialSavingsGoals,
  debts: initialDebts,
  // UI state
  theme: initialTheme,
  currency: initialCurrency,

  // Transaction actions
  addTransaction: (transaction) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    set(state => {
      const newTransactions = [...state.transactions, newTransaction];
      saveToStorage('money-reset-transactions', newTransactions);
      return { transactions: newTransactions };
    });
  },

  updateTransaction: (id, updates) => {
    set(state => {
      const newTransactions = state.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      );
      saveToStorage('money-reset-transactions', newTransactions);
      return { transactions: newTransactions };
    });
  },

  deleteTransaction: (id) => {
    set(state => {
      const newTransactions = state.transactions.filter(t => t.id !== id);
      saveToStorage('money-reset-transactions', newTransactions);
      return { transactions: newTransactions };
    });
  },

  // Budget category actions
  addBudgetCategory: (category) => {
    const newCategory = { ...category, id: uuidv4() };
    set(state => {
      const newCategories = [...state.budgetCategories, newCategory];
      saveToStorage('money-reset-budget', newCategories);
      return { budgetCategories: newCategories };
    });
  },

  updateBudgetCategory: (id, updates) => {
    set(state => {
      const newCategories = state.budgetCategories.map(c =>
        c.id === id ? { ...c, ...updates } : c
      );
      saveToStorage('money-reset-budget', newCategories);
      return { budgetCategories: newCategories };
    });
  },

  deleteBudgetCategory: (id) => {
    set(state => {
      const newCategories = state.budgetCategories.filter(c => c.id !== id);
      saveToStorage('money-reset-budget', newCategories);
      return { budgetCategories: newCategories };
    });
  },

  // Savings goal actions
  addSavingsGoal: (goal) => {
    const newGoal = { ...goal, id: uuidv4() };
    set(state => {
      const newGoals = [...state.savingsGoals, newGoal];
      saveToStorage('money-reset-savings', newGoals);
      return { savingsGoals: newGoals };
    });
  },

  updateSavingsGoal: (id, updates) => {
    set(state => {
      const newGoals = state.savingsGoals.map(g =>
        g.id === id ? { ...g, ...updates } : g
      );
      saveToStorage('money-reset-savings', newGoals);
      return { savingsGoals: newGoals };
    });
  },

  deleteSavingsGoal: (id) => {
    set(state => {
      const newGoals = state.savingsGoals.filter(g => g.id !== id);
      saveToStorage('money-reset-savings', newGoals);
      return { savingsGoals: newGoals };
    });
  },

  // Debt actions
  addDebt: (debt) => {
    const newDebt = { ...debt, id: uuidv4() };
    set(state => {
      const newDebts = [...state.debts, newDebt];
      saveToStorage('money-reset-debts', newDebts);
      return { debts: newDebts };
    });
  },

  updateDebt: (id, updates) => {
    set(state => {
      const newDebts = state.debts.map(d =>
        d.id === id ? { ...d, ...updates } : d
      );
      saveToStorage('money-reset-debts', newDebts);
      return { debts: newDebts };
    });
  },

  deleteDebt: (id) => {
    set(state => {
      const newDebts = state.debts.filter(d => d.id !== id);
      saveToStorage('money-reset-debts', newDebts);
      return { debts: newDebts };
    });
  },

  // Setter actions for demo data
  setTransactions: (transactions) => {
    set(() => {
      saveToStorage('money-reset-transactions', transactions);
      return { transactions };
    });
  },

  setBudgetCategories: (categories) => {
    set(() => {
      saveToStorage('money-reset-budget', categories);
      return { budgetCategories: categories };
    });
  },

  setSavingsGoals: (goals) => {
    set(() => {
      saveToStorage('money-reset-savings', goals);
      return { savingsGoals: goals };
    });
  },

  setDebts: (debts) => {
    set(() => {
      saveToStorage('money-reset-debts', debts);
      return { debts: debts };
    });
  },

  // UI actions
  setTheme: (theme) => {
    set(_state => {
      // Apply theme to document
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      saveToStorage('money-reset-theme', theme);
      return { theme };
    });
  },

  setCurrency: (currency) => {
    set(_state => {
      saveToStorage('money-reset-currency', currency);
      return { currency };
    });
  },

  // Computed values
  getDashboardStats: () => {
    const state = get();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

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
import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Icon from '../components/Icon';
import type { Transaction, BudgetCategory, SavingsGoal, Debt } from '../types/finance';

const Settings: React.FC<{ onRestartOnboarding?: () => void }> = ({ onRestartOnboarding }) => {
  const { theme, currency, setTheme, setCurrency, setTransactions, setBudgetCategories, setSavingsGoals, setDebts } = useFinanceStore();
  const [demoDataLoaded, setDemoDataLoaded] = useState(false);

  // Apply theme on initial load (in case store hydration is async)
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleResetDemoData = () => {
    if (window.confirm('This will reset all your data to the demo state. Are you sure?')) {
      // Clear all localStorage items related to the app
      localStorage.removeItem('money-reset-transactions');
      localStorage.removeItem('money-reset-budget');
      localStorage.removeItem('money-reset-savings');
      localStorage.removeItem('money-reset-debts');
      localStorage.removeItem('money-reset-theme');
      localStorage.removeItem('money-reset-currency');

      // Reload the page to reflect the cleared state
      window.location.reload();
    }
  };

  const handleLoadDemoData = () => {
    if (window.confirm('This will replace your current data with demo data. Continue?')) {
      // Demo transactions
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

      // Demo budget categories (with some spent amounts)
      const demoBudgetCategories: BudgetCategory[] = [
        { id: 'food', name: 'Food', budgetedAmount: 500, spentAmount: 230 },
        { id: 'transport', name: 'Transport', budgetedAmount: 300, spentAmount: 60 },
        { id: 'bills', name: 'Bills', budgetedAmount: 800, spentAmount: 75 },
        { id: 'shopping', name: 'Shopping', budgetedAmount: 200, spentAmount: 45 },
        { id: 'entertainment', name: 'Entertainment', budgetedAmount: 150, spentAmount: 45 },
        { id: 'health', name: 'Health', budgetedAmount: 100, spentAmount: 25 },
        { id: 'other', name: 'Other', budgetedAmount: 100, spentAmount: 0 }
      ];

      // Demo savings goals
      const demoSavingsGoals: SavingsGoal[] = [
        { id: 'emergency-fund', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1500, deadline: '2026-12-31' },
        { id: 'vacation', name: 'Vacation', targetAmount: 3000, currentAmount: 750, deadline: '2027-06-30' },
        { id: 'home-downpayment', name: 'Home Downpayment', targetAmount: 20000, currentAmount: 5000, deadline: '2028-12-31' }
      ];

      // Demo debts
      const demoDebts: Debt[] = [
        { id: 'credit-card', name: 'Credit Card Debt', totalAmount: 2500, paidAmount: 500 },
        { id: 'student-loan', name: 'Student Loan', totalAmount: 15000, paidAmount: 3000 },
        { id: 'car-loan', name: 'Car Loan', totalAmount: 10000, paidAmount: 2000 }
      ];

      // Set the demo data in the store (which will also save to localStorage)
      setTransactions(demoTransactions);
      setBudgetCategories(demoBudgetCategories);
      setSavingsGoals(demoSavingsGoals);
      setDebts(demoDebts);

      setDemoDataLoaded(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start pb-3 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      {/* Appearance Settings */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
        </div>
        <div className="pt-4 space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Theme</p>
            <div className="mt-1">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Default Currency</p>
            <div className="mt-1">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
                <option value="AUD">Australian Dollar (A$)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Data Management</h2>
        </div>
        <div className="pt-4 space-y-4">
          <div className="flex items-center space-x-3">
            <Icon name="refresh-cw" className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-medium text-gray-800">Demo Data</h3>
              <p className="text-sm text-gray-500">
                Load sample data to see how the dashboard looks with example transactions
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleLoadDemoData}
              className="w-full"
            >
              {demoDataLoaded ? 'Demo Data Loaded' : 'Load Demo Data'}
            </Button>
          </div>

          <div className="pt-6 border-t">
            <div className="flex items-center space-x-3">
              <Icon name="trash-2" className="h-5 w-5 text-destructive-600" />
              <div>
                <h3 className="font-medium text-gray-800">Reset All Data</h3>
                <p className="text-sm text-gray-500">
                  Delete all your financial data and start fresh. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="danger"
                onClick={handleResetDemoData}
                className="w-full"
              >
                Reset All Data
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Onboarding */}
      {onRestartOnboarding && (
        <Card>
          <div className="flex justify-between items-start pb-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Onboarding</h2>
          </div>
          <div className="pt-4">
            <p className="text-sm text-gray-500 mb-2">
              Reset the onboarding flow to see the welcome screen again.
            </p>
            <Button
              variant="outline"
              onClick={onRestartOnboarding}
              className="w-full"
            >
              Restart Onboarding
            </Button>
          </div>
        </Card>
      )}

      {/* About */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">About Money Reset</h2>
        </div>
        <div className="pt-4 space-y-6">
          <div className="flex items-start space-x-4">
            <Icon name="settings" className="h-5 w-5 text-primary-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">Money Reset v1.0</h3>
              <p className="text-sm text-gray-500">
                A modern, polished personal finance dashboard designed to help you understand,
                organize, and improve your personal finances through simple visualizations.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-400">
              Built with React, TypeScript, and modern web technologies.
              &copy; 2026 Money Reset. All rights reserved.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
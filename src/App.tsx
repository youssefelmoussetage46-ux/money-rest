import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import { useFinanceStore } from './hooks/useFinanceStore';
import type { Transaction, BudgetCategory, SavingsGoal, Debt } from './types/finance';

// Import pages
import Dashboard from './pages/Dashboard';
import IncomeTracker from './pages/IncomeTracker';
import ExpenseTracker from './pages/ExpenseTracker';
import BudgetPlanner from './pages/BudgetPlanner';
import SavingsGoals from './pages/SavingsGoals';
import DebtTracker from './pages/DebtTracker';
import MonthlyOverview from './pages/MonthlyOverview';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Icon from './components/Icon';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const onboarded = localStorage.getItem('money-reset-onboarded');
    return onboarded === null;
  });
  const navigate = useNavigate();

  // Get store setters for demo data
  const { setTransactions, setBudgetCategories, setSavingsGoals, setDebts } = useFinanceStore();

  // Initialize auth store
  const authStore = useAuthStore();
  const initializeAuth = useAuthStore((state) => state.initialize);
  const location = useLocation();
  const isPublicPath = ['/', '/login', '/signup'].includes(location.pathname);

  // Initialize auth state on app load
  useEffect(() => {
    const cleanup = authStore.initialize();
    return cleanup;
  }, [initializeAuth]);

  // Set initial sidebar state based on window width
  useEffect(() => {
    const updateSidebar = () => {
      setIsSidebarOpen(window.innerWidth >= 768); // md breakpoint
    };
    updateSidebar();
    window.addEventListener('resize', updateSidebar);
    return () => window.removeEventListener('resize', updateSidebar);
  }, []);

  const handleStartFresh = () => {
    // Just close onboarding, start with empty data (or whatever is in localStorage from previous use)
    localStorage.setItem('money-reset-onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleExploreDemo = () => {
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

    // Mark onboarding as complete
    localStorage.setItem('money-reset-onboarded', 'true');
    setShowOnboarding(false);
    navigate('/dashboard');
  };

  const handleRestartOnboarding = () => {
    // This will be called from Settings
    localStorage.removeItem('money-reset-onboarded');
    setShowOnboarding(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hamburger button - only visible on mobile */}
      {!isPublicPath && (
        <button
          className="md:hidden fixed left-4 top-4 z-20 p-2 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? (
            <Icon name="x" className="h-5 w-5" />
          ) : (
            <Icon name="menu" className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Sidebar */}
      {!isPublicPath && (
        <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 ${isSidebarOpen ? 'transform translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
          <div className="flex-shrink-0 flex items-center px-6 py-4 border-b border-gray-100">
            <span className="text-xl font-bold text-primary-600">Money Reset</span>
          </div>
          <nav className="mt-6 space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/income"
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Income Tracker
            </NavLink>
            <NavLink
              to="/expenses"
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Expense Tracker
            </NavLink>
            <NavLink
              to="/budget"
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Budget Planner
            </NavLink>
            <NavLink
              to="/savings"
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Savings Goals
            </NavLink>
            <NavLink
              to="/debt"
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Debt Tracker
            </NavLink>
            <NavLink
              to="/overview"
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Monthly Overview
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              Settings
            </NavLink>

            {/* Logout button */}
            <button
              onClick={async () => {
                await authStore.signOut();
                // Redirect to login after logout
                window.location.href = '/login';
              }}
              className="mt-8 flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <Icon name="x" className="h-4 w-4 mr-2" />
              Logout
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 p-6 overflow-y-auto ${isSidebarOpen ? 'md:ml-64' : 'ml-0'} transition-transform duration-300 ease-in-out`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/income" element={
            <ProtectedRoute>
              <IncomeTracker />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <ExpenseTracker />
            </ProtectedRoute>
          } />
          <Route path="/budget" element={
            <ProtectedRoute>
              <BudgetPlanner />
            </ProtectedRoute>
          } />
          <Route path="/savings" element={
            <ProtectedRoute>
              <SavingsGoals />
            </ProtectedRoute>
          } />
          <Route path="/debt" element={
            <ProtectedRoute>
              <DebtTracker />
            </ProtectedRoute>
          } />
          <Route path="/overview" element={
            <ProtectedRoute>
              <MonthlyOverview />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings onRestartOnboarding={handleRestartOnboarding} />
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<div className="text-center py-12"><h1 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h1><p className="mt-4 text-gray-600">The page you're looking for doesn't exist.</p></div>} />
        </Routes>
      </main>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Money Reset</h2>
            <p className="text-gray-600 mb-6">
              Money Reset helps you understand your money, control spending, plan budgets, build savings, and track debt.
              Get started by choosing an option below.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleStartFresh}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
              >
                Start Fresh
              </button>
              <button
                onClick={handleExploreDemo}
                className="w-full flex items-center justify-center px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors duration-200"
              >
                Explore Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
import { Outlet, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useDemoFinanceStore } from '../hooks/useDemoFinanceStore';
import Icon from '../components/Icon';
const DemoLayout: React.FC = () => {
  const { setTheme } = useDemoFinanceStore();

  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('money-reset-theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, [setTheme]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hamburger button - only visible on mobile */}
      <button
        className="md:hidden fixed left-4 top-4 z-20 p-2 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100"
        onClick={() => {
          // Toggle sidebar logic would go here - simplified for demo
        }}
        aria-label="Toggle menu"
      >
        <Icon name="menu" className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100
        transform translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex-shrink-0 flex items-center px-6 py-4 border-b border-gray-100">
          <span className="text-xl font-bold text-primary-600">Money Reset Demo</span>
        </div>
        <nav className="mt-6 space-y-1">
          <NavLink
            to="/demo"
            end
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/demo/income"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Income Tracker
          </NavLink>
          <NavLink
            to="/demo/expenses"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Expense Tracker
          </NavLink>
          <NavLink
            to="/demo/budget"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Budget Planner
          </NavLink>
          <NavLink
            to="/demo/savings"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Savings Goals
          </NavLink>
          <NavLink
            to="/demo/debt"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Debt Tracker
          </NavLink>
          <NavLink
            to="/demo/overview"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Monthly Overview
          </NavLink>
          <NavLink
            to="/demo/settings"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            Settings
          </NavLink>

          {/* Logout button (in demo, just resets demo state) */}
          <button
            onClick={() => {
              // Reset demo state to initial values by reloading the page
              window.location.reload();
            }}
            className="mt-8 flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Icon name="x" className="h-4 w-4 mr-2" />
            Reset Demo
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-6 overflow-y-auto md:ml-64 transition-transform duration-300 ease-in-out`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DemoLayout;
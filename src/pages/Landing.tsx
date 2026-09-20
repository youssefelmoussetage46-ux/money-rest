import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Icon from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../hooks/useFinanceStore';
import type { Transaction, BudgetCategory, SavingsGoal, Debt } from '../types/finance';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setTransactions, setBudgetCategories, setSavingsGoals, setDebts } = useFinanceStore();

  // Function to handle Explore Demo button click
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

    // Set the demo data in the store
    setTransactions(demoTransactions);
    setBudgetCategories(demoBudgetCategories);
    setSavingsGoals(demoSavingsGoals);
    setDebts(demoDebts);

    // Set localStorage flag for completed onboarding
    localStorage.setItem('money-reset-onboarded', 'true');

    // Navigate to demo page
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Money Reset
          </h1>
          <p className="text-2xl text-primary-600 mb-8">
            Take control of your money. Reset your finances.
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            A beautifully designed personal finance dashboard that helps you understand your spending,
            create effective budgets, build savings, and track debt—all in one intuitive interface.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant="primary"
              onClick={() => {
                navigate('/signup');
              }}
              className="px-8 py-3 text-lg"
            >
              Start Your Money Reset
            </Button>
            <Button
              variant="outline"
              onClick={handleExploreDemo}
              className="px-8 py-3 text-lg border-primary-600"
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Master Your Money
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Income Tracking */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Icon name="trending-up" className="h-8 w-8 mr-4 text-primary-600" />
                <h3 className="text-xl font-semibold">Track Income</h3>
              </div>
              <p className="text-muted-foreground">
                Record all your income sources in one place. See your total earnings
                at a glance and understand your cash flow.
              </p>
            </Card>

            {/* Feature 2: Expense Tracking */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Icon name="trending-down" className="h-8 w-8 mr-4 text-destructive-600" />
                <h3 className="text-xl font-semibold">Track Expenses</h3>
              </div>
              <p className="text-muted-foreground">
                Categorize and monitor your spending. Identify patterns and find
                opportunities to save money each month.
              </p>
            </Card>

            {/* Feature 3: Budget Planning */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Icon name="piggy-bank" className="h-8 w-8 mr-4 text-success-600" />
                <h3 className="text-xl font-semibold">Create Budgets</h3>
              </div>
              <p className="text-muted-foreground">
                Set monthly spending limits for different categories. Get alerts
                when you're approaching your budget limits.
              </p>
            </Card>

            {/* Feature 4: Savings Goals */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Icon name="banknote" className="h-8 w-8 mr-4 text-accent-600" />
                <h3 className="text-xl font-semibold">Track Savings Goals</h3>
              </div>
              <p className="text-muted-foreground">
                Set and monitor progress toward your financial goals. Whether it's
                an emergency fund, vacation, or down payment—watch your savings grow.
              </p>
            </Card>

            {/* Feature 5: Debt Tracking */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Icon name="credit-card" className="h-8 w-8 mr-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Track Debts</h3>
              </div>
              <p className="text-muted-foreground">
                Monitor all your debts in one place. See payoff progress and
                understand your debt-to-income ratio.
              </p>
            </Card>

            {/* Feature 6: Monthly Insights */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Icon name="calendar" className="h-8 w-8 mr-4 text-primary-600" />
                <h3 className="text-xl font-semibold">Understand Monthly Spending</h3>
              </div>
              <p className="text-muted-foreground">
                Visualize your income vs expenses each month. See net savings
                and make informed financial decisions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">How Money Reset Works</h2>
          <div className="flex flex-col items-center gap-12">
            {/* Step 1: Track */}
            <div className="flex items-center space-x-8 max-w-md">
              <div className="flex-shrink-0">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-xl font-bold">1</span>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Track Your Money</h3>
                <p className="text-muted-foreground">
                  Add your income, expenses, budgets, savings goals, and debts.
                  Everything stays organized in one secure place.
                </p>
              </div>
            </div>

            {/* Step 2: Understand */}
            <div className="flex items-center space-x-8 max-w-md">
              <div className="flex-shrink-0">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-xl font-bold">2</span>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Understand Your Finances</h3>
                <p className="text-muted-foreground">
                  See clear visualizations of your spending patterns, savings
                  progress, and debt payoff. Know exactly where your money goes.
                </p>
              </div>
            </div>

            {/* Step 3: Reset */}
            <div className="flex items-center space-x-8 max-w-md">
              <div className="flex-shrink-0">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-xl font-bold">3</span>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Reset Your Financial Future</h3>
                <p className="text-muted-foreground">
                  Make informed decisions, adjust your habits, and build the
                  financial life you want. Your money reset starts today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Your Financial Command Center</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Money Reset is designed to give you one organized place to understand
            and manage your personal finances. No more scattered spreadsheets or
            complicated apps—just clear, actionable insights to help you make
            better financial decisions.
          </p>
          <div className="bg-card rounded-xl p-8 shadow-sm">
            <p className="text-muted-foreground italic">
              "Finally, a finance tool that's actually enjoyable to use. I've
              gained real clarity on my spending habits and feel more in control
              of my money than ever before."
            </p>
            <p className="text-right text-sm font-medium mt-6">— A satisfied user</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Take Control of Your Money?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of people who are using Money Reset to understand
            their finances, reduce financial stress, and work toward their goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              onClick={() => {
                navigate('/signup');
              }}
              className="px-8 py-3 text-lg font-semibold"
            >
              Start Your Money Reset
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigate('/login');
              }}
              className="px-8 py-3 text-lg font-semibold border-primary-600"
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={handleExploreDemo}
              className="px-8 py-3 text-lg font-semibold border-primary-600"
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
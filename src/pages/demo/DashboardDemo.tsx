import React from 'react';
import { useDemoFinanceStore } from '../../hooks/useDemoFinanceStore';
import { useCurrency } from '../../hooks/useCurrency';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../components/Icon';

const DashboardDemo: React.FC = () => {
  const {
    transactions,
    getDashboardStats,
    getExpensesByCategory
  } = useDemoFinanceStore();
  const navigate = useNavigate();

  const formatCurrency = useCurrency();

  const stats = getDashboardStats();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const expensesByCategory = getExpensesByCategory(currentYear, currentMonth);

  // Prepare data for expense chart
  const expenseChartData = Object.entries(expensesByCategory)
    .filter(([_category, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount
    }));

  // Brand colors for chart
  const brandColors = [
    '#4caf50', // primary-500
    '#66bb6a', // primary-400
    '#81c784', // primary-300
    '#a5d6a7', // primary-200
    '#f59e0b', // accent-500
    '#fbbf24', // accent-400
    '#fcd34d', // accent-300
    '#fdba74', // accent-200
    '#fef08a', // accent-100
    '#e53935', // destructive-500
    '#ef5350', // destructive-400
    '#e57373', // destructive-300
    '#ef9a9a', // destructive-200
    '#ffcdd2', // destructive-100
  ];

  // Recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <Icon name="trending-up" className="text-primary-600 h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.totalIncome)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <Icon name="trending-down" className="text-destructive-600 h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-destructive-600">{formatCurrency(stats.totalExpenses)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <Icon name="banknote" className="text-accent-600 h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Current Balance</p>
              <p className="text-4xl font-bold text-accent-600">{formatCurrency(stats.currentBalance)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <Icon name="piggy-bank" className="text-success-600 h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Savings</p>
              <p className="text-2xl font-bold text-success-600">{formatCurrency(stats.totalSavings)}</p>
            </div>
          </div>
          <ProgressBar
            value={stats.savingsRate}
            label="Savings Rate"
            showValue
            color={stats.savingsRate >= 20 ? 'green' : stats.savingsRate >= 10 ? 'yellow' : 'red'}
          />
        </Card>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <Card>
          <div className="flex justify-between items-start pb-3 border-b">
            <h3 className="text-lg font-semibold text-gray-800">This Month</h3>
          </div>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Income</span>
              <span className="text-sm font-medium">{formatCurrency(stats.monthlyIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Expenses</span>
              <span className="text-sm font-medium">{formatCurrency(stats.monthlyExpenses)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium text-gray-600">Net</span>
              <span className={`text-sm font-medium ${stats.monthlyIncome >= stats.monthlyExpenses ? 'text-success-600' : 'text-destructive-600'}`}>
                {formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
              </span>
            </div>
          </div>
        </Card>

        {/* Expenses by Category Chart */}
        <Card>
          <div className="flex justify-between items-start pb-3 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Expenses by Category</h3>
          </div>
          {expenseChartData.length > 0 ? (
            <div className="pt-4 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    labelLine={false}
                    label={false}
                  >
                    {expenseChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={brandColors[index % brandColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                    wrapperStyle={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: 4,
                      backgroundColor: 'var(--card)'
                    }}
                    labelStyle={{ color: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value: any) => `${value}`}
                    wrapperStyle={{ color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="pt-8 text-center">
              <Icon name="banknote" className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No expense data for this month</h3>
              <p className="text-sm text-gray-500 mb-6">
                Add some expenses to see your spending breakdown by category.
              </p>
              <Button variant="outline" onClick={() => navigate('/demo/expenses')}>
                Add First Expense
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="pt-4 space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {transaction.type === 'income' ? (
                    <Icon name="trending-up" className="h-5 w-5 text-success-600" />
                  ) : (
                    <Icon name="trending-down" className="h-5 w-5 text-destructive-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-800">{transaction.description}</h4>
                    <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-success-600' : 'text-destructive-600'}`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {transaction.category} • {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="pt-8 text-center">
              <Icon name="user" className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No transactions yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Start by adding your first income or expense to see your financial activity here.
              </p>
              <Button variant="outline" onClick={() => navigate('/demo/income')}>
                Add First Transaction
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardDemo;
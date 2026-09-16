import React from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { useCurrency } from '../hooks/useCurrency';
import { Card } from '../components/Card';
import { SimpleTable } from '../components/SimpleTable';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subMonths } from 'date-fns';

const MonthlyOverview: React.FC = () => {
  const {
    getMonthlyIncome,
    getMonthlyExpenses,
    getExpensesByCategory
  } = useFinanceStore();
  const formatCurrency = useCurrency();

  // Generate last 6 months data
  const months = [];
  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const year = date.getFullYear();
    const month = date.getMonth();

    months.push(format(date, 'MMM yyyy'));

    const income = getMonthlyIncome(year, month);
    const expenses = getMonthlyExpenses(year, month);

    monthlyData.push({
      month: format(date, 'MMM yyyy'),
      income,
      expenses,
      savings: income - expenses
    });
  }

  // Current month expenses by category
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const expensesByCategory = getExpensesByCategory(currentYear, currentMonth);

  const expenseChartData = Object.entries(expensesByCategory)
    .filter(([_category, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start pb-3 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Monthly Overview</h1>
      </div>

      {/* Monthly Trends */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">6-Month Financial Trends</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">Monthly Savings Trend</span>
          </div>

          <div className="min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" name="Income" stackId="a" barSize={20} fill="#10b981" />
                <Bar dataKey="expenses" name="Expenses" stackId="a" barSize={20} fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{data.month}</span>
                <span className="font-medium">
                  {data.savings >= 0 ?
                    `+${formatCurrency(data.savings)}` :
                    `-${formatCurrency(Math.abs(data.savings))}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Month Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Current Month */}
        <Card>
          <div className="flex justify-between items-start pb-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">This Month Summary</h2>
          </div>
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Income</span>
              <span className="text-lg font-medium text-green-600">
                {formatCurrency(
                  monthlyData[monthlyData.length - 1].income
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Expenses</span>
              <span className="text-lg font-medium text-red-600">
                {formatCurrency(
                  monthlyData[monthlyData.length - 1].expenses
                )}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm font-medium text-gray-600">Net Savings</span>
              <span className={`text-lg font-medium ${monthlyData[monthlyData.length - 1].savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyData[monthlyData.length - 1].savings >= 0 ?
                  `+${formatCurrency(monthlyData[monthlyData.length - 1].savings)}` :
                  `-${formatCurrency(Math.abs(monthlyData[monthlyData.length - 1].savings))}`}
              </span>
            </div>
          </div>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <div className="flex justify-between items-start pb-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Expenses by Category</h2>
          </div>
          <div className="pt-4">
            {expenseChartData.length > 0 ? (
              <div className="min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="value" name="Amount" barSize={20} fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="pt-8 text-center text-gray-500">No expense data for this month</p>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly Details Table */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Monthly Details</h2>
        </div>
        <div className="pt-4">
          <SimpleTable
            columns={[
              { key: 'month', label: 'Month' },
              { key: 'income', label: 'Income', format: (income: number) =>
                formatCurrency(income)
              },
              { key: 'expenses', label: 'Expenses', format: (expenses: number) =>
                formatCurrency(expenses)
              },
              { key: 'savings', label: 'Savings', format: (savings: number) =>
                formatCurrency(savings)
              }
            ]}
            data={monthlyData}
          />
        </div>
      </Card>
    </div>
  );
};

export default MonthlyOverview;
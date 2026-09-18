import React, { useState } from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { useCurrency } from '../hooks/useCurrency';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { SimpleTable } from '../components/SimpleTable';
import { ProgressBar } from '../components/ProgressBar';
import Icon from '../components/Icon';

const BudgetPlanner: React.FC = () => {
  const {
    budgetCategories,
    addBudgetCategory,
    updateBudgetCategory,
    deleteBudgetCategory,
    getExpensesByCategory
  } = useFinanceStore();
  const formatCurrency = useCurrency();

  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    budgetedAmount: ''
  });

  const handleOpenForm = () => {
    setFormVisible(true);
    setEditingId(null);
    setFormData({
      name: '',
      budgetedAmount: ''
    });
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.budgetedAmount) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(formData.budgetedAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than zero');
      return;
    }

    const categoryData = {
      name: formData.name,
      budgetedAmount: amount,
      spentAmount: getExpensesByCategory(new Date().getFullYear(), new Date().getMonth())[formData.name.toLowerCase()] || 0
    };

    if (editingId) {
      updateBudgetCategory(editingId, categoryData);
    } else {
      addBudgetCategory(categoryData);
    }

    handleCloseForm();
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormVisible(true);
    setFormData({
      name: category.name,
      budgetedAmount: category.budgetedAmount.toString()
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget category?')) {
      deleteBudgetCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start pb-3 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Budget Planner</h1>
        <Button variant="primary" onClick={handleOpenForm}>
          <Icon name="plus" className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Budget Form */}
      {formVisible && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Budget Category' : 'Add New Budget Category'}
            </h3>

            <FormInput
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />

            <FormInput
              label="Monthly Budget ($)"
              type="number"
              value={formData.budgetedAmount}
              onChange={(e) => setFormData({...formData, budgetedAmount: e.target.value})}
              required
            />

            <div className="pt-8">
              <Button type="submit" variant="primary">
                {editingId ? 'Update Category' : 'Add Category'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseForm}
                className="ml-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Budget Overview */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {budgetCategories.map(category => {
            const spent = getExpensesByCategory(new Date().getFullYear(), new Date().getMonth())[category.name.toLowerCase()] || 0;
            const remaining = category.budgetedAmount - spent;
            const percentage = category.budgetedAmount > 0 ? (spent / category.budgetedAmount) * 100 : 0;

            return (
              <div key={category.id} className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <span className="text-sm font-medium text-gray-600">
                    {remaining >= 0 ? 'Under Budget' : 'Over Budget'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    Spent:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(spent)}
                  </span>
                  <span className="mx-2">|</span>
                  <span className="text-sm text-gray-500">
                    Remaining:
                  </span>
                  <span className={`
                    font-medium
                    ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {formatCurrency(Math.abs(remaining))}
                  </span>
                </div>
                <ProgressBar
                  value={Math.min(percentage, 100)}
                  label="Budget Usage"
                  showValue
                  color={percentage >= 100 ? 'red' : percentage >= 80 ? 'yellow' : 'green'}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Budget Table */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Budget Categories</h2>
          <span className="text-sm text-gray-500">
            {budgetCategories.length} categories
          </span>
        </div>

        {budgetCategories.length > 0 ? (
          <SimpleTable
            columns={[
              { key: 'name', label: 'Category' },
              { key: 'budgetedAmount', label: 'Budgeted', format: (value: number) =>
                formatCurrency(value)
              },
              { key: 'spentAmount', label: 'Spent', format: (value: number) =>
                formatCurrency(value)
              },
              { key: 'budgetedAmount', label: 'Remaining', format: (budgetedAmount: number, row: any) => {
                const spent = getExpensesByCategory(new Date().getFullYear(), new Date().getMonth())[row.name.toLowerCase()] || 0;
                const remaining = budgetedAmount - spent;
                return formatCurrency(remaining);
              }},
              { key: 'actions', label: 'Actions', format: (_value: any, row: any) => (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(row)}
                    className="hover:text-indigo-600"
                    aria-label="Edit budget category"
                  >
                    <Icon name="edit" className="mr-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                    className="hover:text-red-600 text-red-500"
                    aria-label="Delete budget category"
                  >
                    <Icon name="trash-2" className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            ]}
            data={budgetCategories}
          />
        ) : (
          <div className="text-center py-12">
            <Icon name="piggy-bank" className="h-10 w-10 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No budget categories yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Create budget categories to plan your monthly spending and stay on track with your financial goals.
            </p>
            <Button variant="primary" onClick={handleOpenForm} className="flex items-center justify-center gap-2">
              <Icon name="plus" className="h-4 w-4" />
              Add First Category
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BudgetPlanner;
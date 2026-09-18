import React, { useState } from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { useCurrency } from '../hooks/useCurrency';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { SimpleTable } from '../components/SimpleTable';
import { ProgressBar } from '../components/ProgressBar';
import Icon from '../components/Icon';
import { startOfToday } from 'date-fns';

const SavingsGoals: React.FC = () => {
  const {
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal
  } = useFinanceStore();
  const formatCurrency = useCurrency();

  const totalCurrent = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  const clampedProgress = Math.max(0, Math.min(100, overallProgress));

  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  const handleOpenForm = () => {
    setFormVisible(true);
    setEditingId(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: ''
    });
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.targetAmount || !formData.currentAmount || !formData.deadline) {
      alert('Please fill in all fields');
      return;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount);

    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid target amount greater than zero');
      return;
    }

    if (isNaN(currentAmount) || currentAmount <= 0) {
      alert('Please enter a valid current amount greater than zero');
      return;
    }

    if (targetAmount < currentAmount) {
      alert('Target amount must be greater than or equal to current amount');
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    if (isNaN(deadlineDate.getTime())) {
      alert('Please enter a valid date');
      return;
    }

    const goalData = {
      name: formData.name,
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      deadline: formData.deadline
    };

    if (editingId) {
      updateSavingsGoal(editingId, goalData);
    } else {
      addSavingsGoal(goalData);
    }

    handleCloseForm();
  };

  const handleEdit = (goal: any) => {
    setEditingId(goal.id);
    setFormVisible(true);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      deleteSavingsGoal(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start pb-3 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Savings Goals</h1>
        <Button variant="primary" onClick={handleOpenForm}>
          <Icon name="plus" className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      </div>

      {/* Savings Form */}
      {formVisible && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Savings Goal' : 'Add New Savings Goal'}
            </h3>

            <FormInput
              label="Goal Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Target Amount ($)"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                required
              />

              <FormInput
                label="Current Amount ($)"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Target Date<span className="text-red-500">*</span>
              </label>
              <input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                min={startOfToday().toISOString().split('T')[0]}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="pt-8">
              <Button type="submit" variant="primary">
                {editingId ? 'Update Goal' : 'Add Goal'}
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

      {/* Savings Overview */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Savings Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total Saved</span>
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(
                savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Goals Progress</span>
            <span className="text-sm font-medium text-gray-600">
              {savingsGoals.filter(g => g.currentAmount >= g.targetAmount).length} of {savingsGoals.length} goals completed
            </span>
          </div>

          <ProgressBar
            value={clampedProgress}
            label="Overall Savings Progress"
            showValue
            color="green"
          />
        </div>
      </Card>

      {/* Savings Goals List */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Savings Goals</h2>
          <span className="text-sm text-gray-500">
            {savingsGoals.length} goals
          </span>
        </div>

        {savingsGoals.length > 0 ? (
          <SimpleTable
            columns={[
              { key: 'name', label: 'Goal Name' },
              { key: 'targetAmount', label: 'Target Amount', format: (targetAmount: number) =>
                formatCurrency(targetAmount)
              },
              { key: 'currentAmount', label: 'Current Amount', format: (currentAmount: number) =>
                formatCurrency(currentAmount)
              },
              { key: 'currentAmount', label: 'Progress', format: (currentAmount: number, row: any) => {
                const percentage = row.targetAmount > 0 ? (currentAmount / row.targetAmount) * 100 : 0;
                return `${Math.min(percentage, 100).toFixed(1)}%`;
              }},
              { key: 'deadline', label: 'Target Date', format: (value: string) =>
                new Date(value).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              },
              { key: 'actions', label: 'Actions', format: (_value: any, row: any) => (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(row)}
                    className="hover:text-indigo-600"
                    aria-label="Edit savings goal"
                  >
                    <Icon name="edit" className="mr-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                    className="hover:text-red-600 text-red-500"
                    aria-label="Delete savings goal"
                  >
                    <Icon name="trash-2" className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            ]}
            data={savingsGoals}
          />
        ) : (
          <div className="text-center py-12">
            <Icon name="piggy-bank" className="h-10 w-10 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No savings goals yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Set savings goals to work toward your financial dreams, whether it's an emergency fund, vacation, or big purchase.
            </p>
            <Button variant="primary" onClick={handleOpenForm} className="flex items-center justify-center gap-2">
              <Icon name="plus" className="h-4 w-4" />
              Add First Goal
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SavingsGoals;
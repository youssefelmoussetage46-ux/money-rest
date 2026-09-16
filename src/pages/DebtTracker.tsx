import React, { useState } from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { useCurrency } from '../hooks/useCurrency';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { SimpleTable } from '../components/SimpleTable';
import { ProgressBar } from '../components/ProgressBar';
import Icon from '../components/Icon';

const DebtTracker: React.FC = () => {
  const {
    debts,
    addDebt,
    updateDebt,
    deleteDebt
  } = useFinanceStore();
  const formatCurrency = useCurrency();

  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    paidAmount: ''
  });

  const handleOpenForm = () => {
    setFormVisible(true);
    setEditingId(null);
    setFormData({
      name: '',
      totalAmount: '',
      paidAmount: '0'
    });
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.totalAmount || !formData.paidAmount) {
      alert('Please fill in all fields');
      return;
    }

    const debtData = {
      name: formData.name,
      totalAmount: parseFloat(formData.totalAmount),
      paidAmount: parseFloat(formData.paidAmount)
    };

    if (editingId) {
      updateDebt(editingId, debtData);
    } else {
      addDebt(debtData);
    }

    handleCloseForm();
  };

  const handleEdit = (debt: any) => {
    setEditingId(debt.id);
    setFormVisible(true);
    setFormData({
      name: debt.name,
      totalAmount: debt.totalAmount.toString(),
      paidAmount: debt.paidAmount.toString()
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      deleteDebt(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start pb-3 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Debt Tracker</h1>
        <Button variant="primary" onClick={handleOpenForm}>
          <Icon name="plus" className="mr-2 h-4 w-4" /> Add Debt
        </Button>
      </div>

      {/* Debt Form */}
      {formVisible && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Debt' : 'Add New Debt'}
            </h3>

            <FormInput
              label="Debt Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Total Amount ($)"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                required
              />

              <FormInput
                label="Amount Paid ($)"
                type="number"
                value={formData.paidAmount}
                onChange={(e) => setFormData({...formData, paidAmount: e.target.value})}
                required
              />
            </div>

            <div className="pt-8">
              <Button type="submit" variant="primary">
                {editingId ? 'Update Debt' : 'Add Debt'}
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

      {/* Debt Overview */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Debt Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total Debt</span>
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(
                debts.reduce((sum, debt) => sum + debt.totalAmount, 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total Paid</span>
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(
                debts.reduce((sum, debt) => sum + debt.paidAmount, 0)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Remaining Debt</span>
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(
                debts.reduce((sum, debt) => sum + (debt.totalAmount - debt.paidAmount), 0)
              )}
            </span>
          </div>

          <ProgressBar
            value={debts.reduce((sum, debt) => sum + debt.totalAmount, 0) > 0 ?
              (debts.reduce((sum, debt) => sum + debt.paidAmount, 0) /
                debts.reduce((sum, debt) => sum + debt.totalAmount, 0)) * 100 : 0}
            label="Debt Payoff Progress"
            showValue
            color="green"
          />
        </div>
      </Card>

      {/* Debts List */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Debts</h2>
          <span className="text-sm text-gray-500">
            {debts.length} debts
          </span>
        </div>

        {debts.length > 0 ? (
          <SimpleTable
            columns={[
              { key: 'name', label: 'Debt Name' },
              { key: 'totalAmount', label: 'Total Amount', format: (totalAmount: number) =>
                formatCurrency(totalAmount)
              },
              { key: 'paidAmount', label: 'Amount Paid', format: (value: number) =>
                formatCurrency(value)
              },
              { key: 'totalAmount', label: 'Remaining', format: (totalAmount: number, row: any) => {
                const remaining = totalAmount - row.paidAmount;
                return formatCurrency(remaining);
              }},
              { key: 'totalAmount', label: 'Progress', format: (totalAmount: number, row: any) => {
                const percentage = totalAmount > 0 ? (row.paidAmount / totalAmount) * 100 : 0;
                return `${Math.min(percentage, 100).toFixed(1)}%`;
              }},
              { key: 'actions', label: 'Actions', format: (_value: any, row: any) => (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(row)}
                    className="hover:text-indigo-600"
                    aria-label="Edit debt"
                  >
                    <Icon name="edit" className="mr-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                    className="hover:text-red-600 text-red-500"
                    aria-label="Delete debt"
                  >
                    <Icon name="trash-2" className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            ]}
            data={debts}
          />
        ) : (
          <div className="text-center py-12">
            <Icon name="credit-card" className="h-10 w-10 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No debts yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Add any debts you want to track and pay off, such as credit cards, loans, or mortgages.
            </p>
            <Button variant="primary" onClick={handleOpenForm} className="flex items-center justify-center gap-2">
              <Icon name="plus" className="h-4 w-4" />
              Add First Debt
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DebtTracker;
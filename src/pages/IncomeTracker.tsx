import React, { useState } from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { useCurrency } from '../hooks/useCurrency';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { SimpleTable } from '../components/SimpleTable';
import Icon from '../components/Icon';

const IncomeTracker: React.FC = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useFinanceStore();
  const formatCurrency = useCurrency();

  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'income' as const,
    amount: '',
    source: '',
    date: '',
    description: ''
  });

  const incomeTransactions = transactions.filter(t => t.type === 'income');

  const handleOpenForm = () => {
    setFormVisible(true);
    setEditingId(null);
    setFormData({
      type: 'income',
      amount: '',
      source: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.source || !formData.date || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than zero');
      return;
    }

    const transactionData = {
      type: formData.type,
      amount: amount,
      category: 'Income', // Income category
      date: formData.date,
      description: formData.description,
      source: formData.source
    };

    if (editingId) {
      updateTransaction(editingId, transactionData);
    } else {
      addTransaction(transactionData);
    }

    handleCloseForm();
  };

  const handleEdit = (transaction: any) => {
    setEditingId(transaction.id);
    setFormVisible(true);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      source: transaction.source || '',
      date: transaction.date,
      description: transaction.description
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start pb-3 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Income Tracker</h1>
        <Button variant="primary" onClick={handleOpenForm}>
          <Icon name="trending-up" className="mr-2 h-4 w-4" /> Add Income
        </Button>
      </div>

      {/* Income Form */}
      {formVisible && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Income' : 'Add New Income'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />

              <FormInput
                label="Source"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                required
              />
            </div>

            <FormInput
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
              <div className="pt-8">
                <Button type="submit" variant="primary">
                  {editingId ? 'Update Income' : 'Add Income'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseForm}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Income List */}
      <Card>
        <div className="flex justify-between items-start pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Income Entries</h2>
          <span className="text-sm text-gray-500">
            {incomeTransactions.length} income entries
          </span>
        </div>

        {incomeTransactions.length > 0 ? (
          <SimpleTable
            columns={[
              { key: 'date', label: 'Date', format: (dateString: string) => new Date(dateString).toLocaleDateString() },
              { key: 'description', label: 'Description' },
              { key: 'source', label: 'Source' },
              { key: 'amount', label: 'Amount', format: (amount: number) =>
                formatCurrency(amount)
              },
              { key: 'actions', label: 'Actions', format: (_value: any, row: any) => (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(row)}
                    className="hover:text-indigo-600"
                    aria-label="Edit transaction"
                  >
                    <Icon name="edit" className="mr-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                    className="hover:text-red-600 text-red-500"
                    aria-label="Delete transaction"
                  >
                    <Icon name="trash-2" className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            ]}
            data={incomeTransactions}
          />
        ) : (
          <div className="text-center py-12">
            <Icon name="trending-up" className="h-10 w-10 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No income entries yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Start tracking your income sources to see your earnings and plan your budget effectively.
            </p>
            <Button variant="primary" onClick={handleOpenForm} className="flex items-center justify-center gap-2">
              <Icon name="plus" className="h-4 w-4" />
              Add First Income
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default IncomeTracker;
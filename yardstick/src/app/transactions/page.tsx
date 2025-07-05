"use client";
import { useState, useRef, useEffect } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList, { Transaction } from "./TransactionList";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import CategoryPieChart from "./CategoryPieChart";
import DashboardCards from "./DashboardCards";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(data: { amount: number; date: string; description: string; category: string }) {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      const newTransaction = await response.json();
      setTransactions((prev) => [newTransaction, ...prev]);
    } catch (err) {
      setError('Failed to create transaction');
      console.error('Error creating transaction:', err);
    }
  }

  async function handleEdit(data: { amount: number; date: string; description: string; category: string }) {
    if (!editing) return;

    try {
      const response = await fetch(`/api/transactions/${editing._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === editing._id ? updatedTransaction : tx
        )
      );
      setEditing(null);
    } catch (err) {
      setError('Failed to update transaction');
      console.error('Error updating transaction:', err);
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      // Clear editing state if the deleted transaction was being edited
      if (editing && editing._id === id) {
        setEditing(null);
      }
    } catch (err) {
      setError('Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    }
  }

  function handleEditStart(transaction: Transaction) {
    setEditing(transaction);
    // Scroll to form with smooth animation
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">
          <div className="text-lg">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Personal Finance Dashboard</h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Dashboard Cards */}
      <DashboardCards transactions={transactions} />

      <div className="grid gap-8 md:grid-cols-2 mb-8">
        <section ref={formRef}>
          <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Transaction" : "Add Transaction"}</h2>
          <TransactionForm
            onSubmit={editing ? handleEdit : handleAdd}
            initialData={editing || undefined}
            onReset={() => setEditing(null)}
          />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <CategoryPieChart transactions={transactions} />
        </section>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
        <MonthlyExpensesChart transactions={transactions} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
        <TransactionList
          transactions={transactions}
          onDelete={handleDelete}
          onEdit={handleEditStart}
        />
      </section>
    </div>
  );
} 
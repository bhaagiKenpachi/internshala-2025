"use client";
import { useState, useEffect } from "react";
import BudgetManager, { Budget } from "../transactions/BudgetManager";
import BudgetVsActualChart from "../transactions/BudgetVsActualChart";
import { Target, AlertTriangle, CheckCircle } from "lucide-react";
import { Transaction } from "../transactions/TransactionList";

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [budgetsResponse, transactionsResponse] = await Promise.all([
                fetch('/api/budgets'),
                fetch('/api/transactions')
            ]);

            if (!budgetsResponse.ok) throw new Error('Failed to fetch budgets');
            if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');

            const budgetsData = await budgetsResponse.json();
            const transactionsData = await transactionsResponse.json();

            setBudgets(budgetsData);
            setTransactions(transactionsData);
        } catch {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddBudget(budgetData: Omit<Budget, '_id'>) {
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetData),
            });
            if (!response.ok) throw new Error('Failed to create budget');
            const newBudget = await response.json();
            setBudgets((prev) => [newBudget, ...prev]);
        } catch {
            setError('Failed to create budget');
        }
    }

    async function handleUpdateBudget(budget: Budget) {
        try {
            const response = await fetch(`/api/budgets/${budget._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budget),
            });
            if (!response.ok) throw new Error('Failed to update budget');
            const updatedBudget = await response.json();
            setBudgets((prev) => prev.map((b) => b._id === budget._id ? updatedBudget : b));
        } catch {
            setError('Failed to update budget');
        }
    }

    async function handleDeleteBudget(id: string) {
        try {
            const response = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete budget');
            setBudgets((prev) => prev.filter((b) => b._id !== id));
        } catch {
            setError('Failed to delete budget');
        }
    }

    // Calculate budget status for each category with actual spending
    const budgetStatus = budgets.map(budget => {
        const spent = transactions
            .filter(tx => tx.category === budget.category)
            .reduce((sum, tx) => sum + tx.amount, 0);

        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        return {
            ...budget,
            spent,
            remaining,
            percentage,
            status: percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : 'good'
        };
    });

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalRemaining = totalBudget - totalSpent;

    if (loading) {
        return <div className="p-8 text-center">Loading budgets...</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Management</h1>
                <p className="text-gray-600">Set and track your spending limits across different categories.</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Budget</p>
                            <p className="text-2xl font-bold text-gray-900">₹{totalBudget.toFixed(2)}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Spent</p>
                            <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Remaining</p>
                            <p className={`text-2xl font-bold ${totalRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ₹{Math.abs(totalRemaining).toFixed(2)}
                            </p>
                        </div>
                        <div className={`p-2 rounded-lg ${totalRemaining < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                            {totalRemaining < 0 ? (
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            ) : (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Budget Manager */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Manage Budgets</h2>
                    <BudgetManager
                        budgets={budgets}
                        onAddBudget={handleAddBudget}
                        onUpdateBudget={handleUpdateBudget}
                        onDeleteBudget={handleDeleteBudget}
                    />
                </section>

                {/* Budget vs Actual Chart */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
                    <BudgetVsActualChart
                        transactions={transactions}
                        budgets={budgets}
                    />
                </section>
            </div>

            {/* Budget Status Table */}
            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Budget Status</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Budget
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Spent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Remaining
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {budgetStatus.map((budget) => (
                                    <tr key={budget._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {budget.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{budget.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{budget.spent.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                                                ₹{Math.abs(budget.remaining).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${budget.status === 'danger'
                                                    ? 'bg-red-100 text-red-800'
                                                    : budget.status === 'warning'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                {budget.status === 'danger' ? 'Over Budget' :
                                                    budget.status === 'warning' ? 'Warning' : 'On Track'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
} 
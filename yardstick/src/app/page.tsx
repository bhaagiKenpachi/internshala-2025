"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, TrendingUp, TrendingDown, DollarSign, Target, BarChart3, AlertTriangle, Lightbulb, Calendar } from "lucide-react";
import { Transaction } from "./transactions/TransactionList";
import { Budget } from "./transactions/BudgetManager";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [transactionsResponse, budgetsResponse] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/budgets')
      ]);

      if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
      if (!budgetsResponse.ok) throw new Error('Failed to fetch budgets');

      const transactionsData = await transactionsResponse.json();
      const budgetsData = await budgetsResponse.json();

      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  // Calculate dashboard statistics
  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const isOverBudget = remainingBudget < 0;

  // Category breakdown
  const categoryBreakdown = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Monthly spending trend
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthTransactions = transactions.filter(tx => tx.date.startsWith(currentMonth));
  const currentMonthSpending = currentMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Previous month comparison
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const previousMonthStr = previousMonth.toISOString().slice(0, 7);
  const previousMonthTransactions = transactions.filter(tx => tx.date.startsWith(previousMonthStr));
  const previousMonthSpending = previousMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const spendingChange = previousMonthSpending > 0
    ? ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100
    : 0;

  // Spending insights
  const generateInsights = () => {
    const insights = [];

    // Budget insights
    if (isOverBudget) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Over Budget',
        message: `You've exceeded your budget by ₹${Math.abs(remainingBudget).toFixed(2)}. Consider reviewing your spending.`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      });
    } else if (remainingBudget < totalBudget * 0.2) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Budget Alert',
        message: `You've used ${((totalExpenses / totalBudget) * 100).toFixed(1)}% of your budget. Be mindful of remaining expenses.`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      });
    }

    // Spending trend insights
    if (spendingChange > 20) {
      insights.push({
        type: 'trend',
        icon: TrendingUp,
        title: 'Spending Increased',
        message: `Your spending is ${spendingChange.toFixed(1)}% higher than last month. Review your recent transactions.`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      });
    } else if (spendingChange < -10) {
      insights.push({
        type: 'trend',
        icon: TrendingDown,
        title: 'Great Progress!',
        message: `Your spending decreased by ${Math.abs(spendingChange).toFixed(1)}% compared to last month. Keep it up!`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      });
    }

    // Category insights
    if (topCategories.length > 0) {
      const [topCategory, topAmount] = topCategories[0];
      const topCategoryBudget = budgets.find(b => b.category === topCategory);

      if (topCategoryBudget && topAmount > topCategoryBudget.amount) {
        insights.push({
          type: 'category',
          icon: BarChart3,
          title: 'Category Over Budget',
          message: `You've exceeded your ${topCategory} budget by ₹${(topAmount - topCategoryBudget.amount).toFixed(2)}.`,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        });
      } else if (topAmount > totalExpenses * 0.4) {
        insights.push({
          type: 'category',
          icon: Lightbulb,
          title: 'High Category Spending',
          message: `${topCategory} accounts for ${((topAmount / totalExpenses) * 100).toFixed(1)}% of your total spending.`,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        });
      }
    }

    // General recommendations
    if (transactions.length === 0) {
      insights.push({
        type: 'recommendation',
        icon: Lightbulb,
        title: 'Get Started',
        message: 'Add your first transaction to start tracking your spending and get personalized insights.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      });
    } else if (budgets.length === 0) {
      insights.push({
        type: 'recommendation',
        icon: Target,
        title: 'Set Budgets',
        message: 'Create budgets for different categories to better manage your spending and track your progress.',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s your financial overview.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

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
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                ₹{Math.abs(remainingBudget).toFixed(2)}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}>
              {isOverBudget ? (
                <TrendingDown className="w-6 h-6 text-red-600" />
              ) : (
                <TrendingUp className="w-6 h-6 text-green-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹{currentMonthSpending.toFixed(2)}</p>
              {previousMonthSpending > 0 && (
                <p className={`text-xs ${spendingChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {spendingChange > 0 ? '+' : ''}{spendingChange.toFixed(1)}% vs last month
                </p>
              )}
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/transactions" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Transaction</h3>
              <p className="text-sm text-gray-600">Record a new expense</p>
            </div>
          </div>
        </Link>

        <Link href="/budgets" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Budgets</h3>
              <p className="text-sm text-gray-600">Set spending limits</p>
            </div>
          </div>
        </Link>

        <Link href="/transactions" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View All</h3>
              <p className="text-sm text-gray-600">See all transactions</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Spending Insights */}
      {insights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.slice(0, 4).map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${insight.bgColor.replace('50', '100')}`}>
                      <IconComponent className={`w-5 h-5 ${insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${insight.color} mb-1`}>{insight.title}</h3>
                      <p className="text-sm text-gray-700">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Spending Categories</h2>
          </div>
          <div className="p-6">
            {topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <span className="font-semibold text-gray-900">₹{amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction!</p>
            )}
            <div className="mt-6">
              <Link
                href="/transactions"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View all categories →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="p-6">
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction!</p>
            )}
            <div className="mt-6">
              <Link
                href="/transactions"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View all transactions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

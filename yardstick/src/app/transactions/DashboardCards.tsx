"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "./TransactionList";

export default function DashboardCards({ transactions }: { transactions: Transaction[] }) {
    const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    const categoryBreakdown = transactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryBreakdown)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            {/* Total Expenses Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Categories Card */}
            <Card>
                <CardContent className="p-6">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-3">Top Categories</p>
                        {topCategories.length > 0 ? (
                            <div className="space-y-2">
                                {topCategories.map(([category, amount]) => (
                                    <div key={category} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">{category}</span>
                                        <span className="text-sm font-medium">₹{amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No transactions yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Transactions Card */}
            <Card>
                <CardContent className="p-6">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-3">Recent Transactions</p>
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-2">
                                {recentTransactions.map((tx) => (
                                    <div key={tx._id} className="flex justify-between items-center">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                                            <p className="text-xs text-gray-500">{tx.category}</p>
                                        </div>
                                        <span className="text-sm font-medium ml-2">₹{tx.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No transactions yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 
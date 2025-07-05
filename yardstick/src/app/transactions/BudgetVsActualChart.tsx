"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "./TransactionList";
import { Budget } from "./BudgetManager";

export default function BudgetVsActualChart({
    transactions,
    budgets
}: {
    transactions: Transaction[];
    budgets: Budget[];
}) {
    // Calculate actual spending by category
    const actualByCategory = transactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    // Combine budget and actual data
    const chartData = budgets.map(budget => ({
        category: budget.category,
        budget: budget.amount,
        actual: actualByCategory[budget.category] || 0,
        difference: (actualByCategory[budget.category] || 0) - budget.amount
    }));

    if (chartData.length === 0) {
        return (
            <Card>
                <CardContent className="p-4">
                    <div className="text-center text-gray-500 py-8">
                        No budgets set. Create budgets to see the comparison.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name) => [
                                `₹${Number(value).toFixed(2)}`,
                                name === 'budget' ? 'Budget' : 'Actual'
                            ]}
                        />
                        <Legend />
                        <Bar dataKey="budget" fill="#8884d8" name="Budget" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" fill="#82ca9d" name="Actual" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>

                {/* Summary */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                        <div className="font-medium">Total Budget</div>
                        <div className="text-blue-600">
                            ₹{chartData.reduce((sum, item) => sum + item.budget, 0).toFixed(2)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-medium">Total Spent</div>
                        <div className="text-green-600">
                            ₹{chartData.reduce((sum, item) => sum + item.actual, 0).toFixed(2)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-medium">Remaining</div>
                        <div className={chartData.reduce((sum, item) => sum + item.difference, 0) >= 0 ? 'text-red-600' : 'text-green-600'}>
                            ₹{chartData.reduce((sum, item) => sum + item.difference, 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 
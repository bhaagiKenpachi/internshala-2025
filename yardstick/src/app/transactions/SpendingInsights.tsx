"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "./TransactionList";
import { Budget } from "./BudgetManager";

export default function SpendingInsights({
    transactions,
    budgets,
    selectedMonth
}: {
    transactions: Transaction[];
    budgets: Budget[];
    selectedMonth: string;
}) {
    // Get transactions for selected month
    const monthTransactions = transactions.filter(tx => tx.date.startsWith(selectedMonth));

    // Calculate actual spending by category
    const actualByCategory = monthTransactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    // Get budgets for selected month
    const monthBudgets = budgets.filter(b => b.month === selectedMonth);

    // Calculate insights
    const totalSpent = monthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalBudget = monthBudgets.reduce((sum, b) => sum + b.amount, 0);
    const remainingBudget = totalBudget - totalSpent;

    // Find overspending categories
    const overspendingCategories = monthBudgets
        .filter(budget => (actualByCategory[budget.category] || 0) > budget.amount)
        .map(budget => ({
            category: budget.category,
            budget: budget.amount,
            actual: actualByCategory[budget.category] || 0,
            overspent: (actualByCategory[budget.category] || 0) - budget.amount
        }));

    // Find highest spending category
    const highestSpendingCategory = Object.entries(actualByCategory)
        .sort(([, a], [, b]) => b - a)[0];

    // Calculate average daily spending
    const daysInMonth = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate();
    const averageDailySpending = totalSpent / daysInMonth;

    // Generate insights
    const insights = [];

    if (overspendingCategories.length > 0) {
        insights.push({
            type: 'warning',
            title: 'Overspending Alert',
            message: `You've overspent in ${overspendingCategories.length} category${overspendingCategories.length > 1 ? 'ies' : 'y'}.`,
            details: overspendingCategories.map(cat =>
                `${cat.category}: ₹${cat.overspent.toFixed(2)} over budget`
            )
        });
    }

    if (remainingBudget > 0) {
        insights.push({
            type: 'success',
            title: 'Budget Status',
            message: `You have ₹${remainingBudget.toFixed(2)} remaining in your budget.`,
            details: [`${((remainingBudget / totalBudget) * 100).toFixed(1)}% of budget remaining`]
        });
    }

    if (highestSpendingCategory) {
        insights.push({
            type: 'info',
            title: 'Highest Spending',
            message: `${highestSpendingCategory[0]} is your highest spending category.`,
            details: [`₹${highestSpendingCategory[1].toFixed(2)} spent this month`]
        });
    }

    if (averageDailySpending > 0) {
        insights.push({
            type: 'info',
            title: 'Daily Average',
            message: `You're spending ₹${averageDailySpending.toFixed(2)} per day on average.`,
            details: [`At this rate, you'll spend ₹${(averageDailySpending * 30).toFixed(2)} this month`]
        });
    }

    // Budget recommendations
    const recommendations = [];

    if (overspendingCategories.length > 0) {
        recommendations.push(
            `Consider reducing spending in ${overspendingCategories.map(cat => cat.category).join(', ')} to stay within budget.`
        );
    }

    if (totalSpent > totalBudget * 0.8) {
        recommendations.push(
            "You're approaching your budget limit. Consider reviewing your spending patterns."
        );
    }

    if (highestSpendingCategory && highestSpendingCategory[1] > totalSpent * 0.4) {
        recommendations.push(
            `${highestSpendingCategory[0]} accounts for a large portion of your spending. Consider if this aligns with your financial goals.`
        );
    }

    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>

                {insights.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        Add some transactions and budgets to see insights
                    </div>
                ) : (
                    <div className="space-y-4">
                        {insights.map((insight, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${insight.type === 'warning' ? 'border-red-200 bg-red-50' :
                                    insight.type === 'success' ? 'border-green-200 bg-green-50' :
                                        'border-blue-200 bg-blue-50'
                                }`}>
                                <div className="font-medium text-sm mb-1">{insight.title}</div>
                                <div className="text-sm text-gray-700 mb-2">{insight.message}</div>
                                {insight.details && (
                                    <div className="text-xs text-gray-600">
                                        {insight.details.map((detail, i) => (
                                            <div key={i}>• {detail}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {recommendations.length > 0 && (
                            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="font-medium text-sm mb-2 text-yellow-800">Recommendations</div>
                                <div className="text-sm text-yellow-700 space-y-1">
                                    {recommendations.map((rec, index) => (
                                        <div key={index}>• {rec}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 
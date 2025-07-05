"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "./TransactionList";

export type Budget = {
    _id: string;
    category: string;
    amount: number;
    month: string; // YYYY-MM format
    createdAt?: Date;
    updatedAt?: Date;
};

export default function BudgetManager({
    budgets,
    onAddBudget,
    onUpdateBudget,
    onDeleteBudget
}: {
    budgets: Budget[];
    onAddBudget: (budget: Omit<Budget, '_id'>) => void;
    onUpdateBudget: (budget: Budget) => void;
    onDeleteBudget: (id: string) => void;
}) {
    const [category, setCategory] = useState("Food & Dining");
    const [amount, setAmount] = useState("");
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [editing, setEditing] = useState<Budget | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editing) {
            setCategory(editing.category);
            setAmount(editing.amount.toString());
            setMonth(editing.month);
        } else {
            setCategory("Food & Dining");
            setAmount("");
            setMonth(new Date().toISOString().slice(0, 7));
        }
    }, [editing]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!amount || !category || !month) {
            setError("All fields are required.");
            return;
        }
        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Please enter a valid amount greater than 0.");
            return;
        }
        setError("");

        if (editing) {
            onUpdateBudget({ ...editing, category, amount: Number(amount), month });
            setEditing(null);
        } else {
            onAddBudget({ category, amount: Number(amount), month });
        }
    }

    function handleCancel() {
        setEditing(null);
        setError("");
    }

    const currentMonthBudgets = budgets.filter(b => b.month === month);

    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                    {editing ? "Edit Budget" : "Set Monthly Budget"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <Label htmlFor="month">Month</Label>
                        <Input
                            id="month"
                            type="month"
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="budget-amount">Budget Amount</Label>
                        <Input
                            id="budget-amount"
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                            {editing ? "Update" : "Add"} Budget
                        </Button>
                        {editing && (
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>

                {/* Current Month Budgets */}
                <div>
                    <h4 className="font-medium mb-3">Current Month Budgets</h4>
                    {currentMonthBudgets.length === 0 ? (
                        <p className="text-sm text-gray-500">No budgets set for this month</p>
                    ) : (
                        <div className="space-y-2">
                            {currentMonthBudgets.map((budget) => (
                                <div key={budget._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="font-medium">{budget.category}</span>
                                        <span className="text-sm text-gray-600 ml-2">₹{budget.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditing(budget)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onDeleteBudget(budget._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 
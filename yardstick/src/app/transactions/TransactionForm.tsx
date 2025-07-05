"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "./TransactionList";

export default function TransactionForm({ onSubmit, initialData, onReset }: {
    onSubmit?: (data: { amount: number; date: string; description: string; category: string }) => void;
    initialData?: { amount: number; date: string; description: string; category: string };
    onReset?: () => void;
}) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const [amount, setAmount] = useState(initialData?.amount || "");
    const [date, setDate] = useState(initialData?.date || today);
    const [description, setDescription] = useState(initialData?.description || "");
    const [category, setCategory] = useState(initialData?.category || "Other");
    const [error, setError] = useState("");

    // Update form fields when initialData changes (for editing)
    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount.toString());
            setDate(initialData.date);
            setDescription(initialData.description);
            setCategory(initialData.category);
        } else {
            setAmount("");
            setDate(today);
            setDescription("");
            setCategory("Other");
        }
    }, [initialData, today]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!amount || !date || !description || !category) {
            setError("All fields are required.");
            return;
        }
        setError("");
        onSubmit?.({ amount: Number(amount), date, description, category });
        // Only reset if not editing
        if (!initialData) {
            setAmount("");
            setDate(today);
            setDescription("");
            setCategory("Other");
        }
    }

    function handleReset() {
        setAmount("");
        setDate(today);
        setDescription("");
        setCategory("Other");
        setError("");
        onReset?.();
    }

    return (
        <Card>
            <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
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
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1">{initialData ? "Update" : "Add"} Transaction</Button>
                        <Button type="button" variant="outline" onClick={handleReset} className="flex-1">Reset</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 
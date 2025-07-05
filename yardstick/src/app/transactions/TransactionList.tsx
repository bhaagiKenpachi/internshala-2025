"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type Transaction = {
    _id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export const CATEGORIES = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Education",
    "Utilities",
    "Housing",
    "Travel",
    "Other"
];

export default function TransactionList({ transactions, onDelete, onEdit }: {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onEdit: (transaction: Transaction) => void;
}) {
    return (
        <Card>
            <CardContent className="p-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">No transactions found.</td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">₹{tx.amount.toFixed(2)}</td>
                                    <td className="px-4 py-2">{tx.date}</td>
                                    <td className="px-4 py-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{tx.description}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => onEdit(tx)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => onDelete(tx._id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
} 
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "./TransactionList";

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
    "#82CA9D", "#FFC658", "#FF6B6B", "#4ECDC4", "#45B7D1"
];

function getCategoryData(transactions: Transaction[]) {
    const map = new Map<string, number>();
    transactions.forEach((tx) => {
        map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
    });
    return Array.from(map.entries()).map(([category, total]) => ({
        name: category,
        value: total
    }));
}

export default function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
    const data = getCategoryData(transactions);

    if (data.length === 0) {
        return (
            <Card>
                <CardContent className="p-4">
                    <div className="text-center text-gray-500 py-8">
                        No transactions to display
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
} 
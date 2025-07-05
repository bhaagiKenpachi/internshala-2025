"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "./TransactionList";

function getMonthlyData(transactions: Transaction[]) {
    const map = new Map<string, number>();
    transactions.forEach((tx) => {
        const month = tx.date.slice(0, 7); // YYYY-MM
        map.set(month, (map.get(month) || 0) + tx.amount);
    });
    return Array.from(map.entries()).map(([month, total]) => ({ month, total }));
}

export default function MonthlyExpensesChart({ transactions }: { transactions: Transaction[] }) {
    const data = getMonthlyData(transactions);
    return (
        <Card>
            <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
} 
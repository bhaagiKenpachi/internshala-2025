import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const transactions = await db.collection('transactions')
            .find({})
            .sort({ date: -1 })
            .toArray();

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, date, description, category } = body;

        if (!amount || !date || !description || !category) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const result = await db.collection('transactions').insertOne({
            amount: Number(amount),
            date,
            description,
            category,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const newTransaction = {
            _id: result.insertedId,
            amount: Number(amount),
            date,
            description,
            category,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
} 
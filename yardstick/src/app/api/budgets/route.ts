import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const budgets = await db.collection('budgets')
            .find({})
            .sort({ month: -1 })
            .toArray();
        return NextResponse.json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch budgets' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category, amount, month } = body;
        if (!category || !amount || !month) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }
        const db = await getDatabase();
        const result = await db.collection('budgets').insertOne({
            category,
            amount: Number(amount),
            month,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const newBudget = {
            _id: result.insertedId,
            category,
            amount: Number(amount),
            month,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return NextResponse.json(newBudget, { status: 201 });
    } catch (error) {
        console.error('Error creating budget:', error);
        return NextResponse.json(
            { error: 'Failed to create budget' },
            { status: 500 }
        );
    }
} 
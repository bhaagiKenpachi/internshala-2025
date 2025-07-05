import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { category, amount, month } = body;
        const { id } = await params;
        if (!category || !amount || !month) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }
        const db = await getDatabase();
        const result = await db.collection('budgets').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    category,
                    amount: Number(amount),
                    month,
                    updatedAt: new Date()
                }
            }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Budget not found' },
                { status: 404 }
            );
        }
        const updatedBudget = {
            _id: id,
            category,
            amount: Number(amount),
            month,
            updatedAt: new Date()
        };
        return NextResponse.json(updatedBudget);
    } catch (error) {
        console.error('Error updating budget:', error);
        return NextResponse.json(
            { error: 'Failed to update budget' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDatabase();
        const result = await db.collection('budgets').deleteOne({
            _id: new ObjectId(id)
        });
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Budget not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        return NextResponse.json(
            { error: 'Failed to delete budget' },
            { status: 500 }
        );
    }
} 
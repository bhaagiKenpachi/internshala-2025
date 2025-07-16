import mongoose, { Document, Schema } from 'mongoose';

export interface ITokenPrice extends Document {
    token: string;
    network: string;
    date: number; // Unix timestamp (start of day)
    price: number;
}

const TokenPriceSchema = new Schema<ITokenPrice>({
    token: { type: String, required: true, index: true },
    network: { type: String, required: true, index: true },
    date: { type: Number, required: true, index: true },
    price: { type: Number, required: true },
});

TokenPriceSchema.index({ token: 1, network: 1, date: 1 }, { unique: true });

export const TokenPrice = mongoose.model<ITokenPrice>('TokenPrice', TokenPriceSchema); 
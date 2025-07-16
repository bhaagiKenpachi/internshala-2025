import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongo } from './db';
import priceRouter from './routes/price';
import scheduleRouter from './routes/schedule';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectMongo();

app.use('/api', priceRouter);
app.use('/api', scheduleRouter);

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Zeru Token Price Oracle API' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
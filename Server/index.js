import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

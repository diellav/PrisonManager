require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.send('Prison Management System API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
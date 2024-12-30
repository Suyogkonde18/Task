
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(bodyParser.json()); 


mongoose.connect("mongodb://localhost:27017/abc", {
    
})
.then(() => console.log('MongoDB connected successfullysss'))
.catch(err => console.error('MongoDB connection failed:', err.message));

// API routes
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

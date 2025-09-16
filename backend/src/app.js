const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

require('dotenv').config();

const authRoutes = require('./routes/auth.routes.js');
const paymentRoutes = require('./routes/payment.routes.js');
const transactionRoutes = require('./routes/transactions.routes.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('School Payment API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/transactions', transactionRoutes);


module.exports = app;
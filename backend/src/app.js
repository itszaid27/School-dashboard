const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('School Payment API is running...');
});

module.exports = app;

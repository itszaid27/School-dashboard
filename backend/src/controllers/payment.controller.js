const axios = require('axios');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order.model.js');
const OrderStatus = require('../models/OrderStatus.model.js');
const PG_KEY = process.env.PG_KEY; 
const API_KEY = process.env.API_KEY;
const SCHOOL_ID = process.env.SCHOOL_ID;

const createPayment = async (req, res) => {
  try {
    const { trustee_id, student_info, amount, callback_url } = req.body;

    if (!amount || !callback_url) {
      return res.status(400).json({ message: 'Amount and callback_url are required' });
    }

    const payload = {
      school_id: SCHOOL_ID,
      amount: amount.toString(),
      callback_url,
    };

    const sign = jwt.sign(payload, PG_KEY);
    const response = await axios.post(
      'https://dev-vanilla.edviron.com/erp/create-collect-request',
      {
        school_id: SCHOOL_ID,
        amount: amount.toString(),
        callback_url,
        sign,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    console.log('🔹 Edviron API Raw Response:', JSON.stringify(response.data, null, 2));

    const { collect_request_id, collect_request_url } = response.data;

    const order = await Order.create({
      school_id: SCHOOL_ID,
      trustee_id,
      student_info,
      gateway_name: 'Edviron',
    });

    await OrderStatus.create({
      collect_id: order._id,
      order_amount: amount,
      status: 'PENDING',
      payment_message: 'Payment link created',
    });

    res.status(200).json({
      collect_request_id,
      payment_url: collect_request_url,
      order_id: order._id,
    });
  } catch (error) {
    console.error('❌ Payment API Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Payment creation failed',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { createPayment };

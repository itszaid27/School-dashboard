const mongoose = require('mongoose');
const Order = require('../models/Order.model.js');
const OrderStatus = require('../models/OrderStatus.model.js');

const getAllTransactions = async (req, res) => {
  try {
    let { page = 1, limit = 10, sort = 'payment_time', order = 'desc' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const sortOrder = order === 'asc' ? 1 : -1;

    const transactions = await Order.aggregate([
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status',
        },
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$status.order_amount',
          transaction_amount: '$status.transaction_amount',
          status: '$status.status',
          custom_order_id: '$_id',
          payment_time: '$status.payment_time',
        },
      },
      { $sort: { [sort]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await Order.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const transactions = await Order.aggregate([
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status',
        },
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$status.order_amount',
          transaction_amount: '$status.transaction_amount',
          status: '$status.status',
          custom_order_id: '$_id',
          payment_time: '$status.payment_time',
        },
      },
      { $sort: { payment_time: -1 } },
    ]);

    res.json({ count: transactions.length, transactions });
  } catch (error) {
    console.error('Error fetching transactions by school:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;

    const transaction = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(custom_order_id) } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status',
        },
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$status.order_amount',
          transaction_amount: '$status.transaction_amount',
          status: '$status.status',
          custom_order_id: '$_id',
          payment_time: '$status.payment_time',
        },
      },
    ]);

    if (!transaction || transaction.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction[0]);
  } catch (error) {
    console.error('Error fetching transaction status:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionsBySchool,
  getTransactionStatus,
};

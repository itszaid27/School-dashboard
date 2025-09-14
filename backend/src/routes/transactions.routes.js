const express = require('express');
const {
  getAllTransactions,
  getTransactionsBySchool,
  getTransactionStatus
} = require('../controllers/transaction.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get('/', protect, getAllTransactions);
router.get('/school/:schoolId', protect, getTransactionsBySchool);
router.get('/status/:custom_order_id', protect, getTransactionStatus);

module.exports = router;
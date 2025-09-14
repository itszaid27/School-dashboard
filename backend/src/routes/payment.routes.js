const express = require('express');
const { createPayment } = require('../controllers/payment.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { handleWebhook } = require('../controllers/webhook.controller.js')

const router = express.Router();

router.post('/create-payment', protect, createPayment);
router.post('/webhook', handleWebhook);

module.exports = router;
const WebhookLog = require('../models/WebhookLog.model.js');
const OrderStatus = require('../models/OrderStatus.model.js');
const Order = require('../models/Order.model.js');

const handleWebhook = async (req, res) => {
  try {
    const payload = req.body;
    await WebhookLog.create({ payload });

    const orderInfo = payload.order_info;
    if (!orderInfo) {
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }

    const order = await Order.findById(orderInfo.order_id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }


    await OrderStatus.findOneAndUpdate(
      { collect_id: order._id },
      {
        order_amount: orderInfo.order_amount,
        transaction_amount: orderInfo.transaction_amount,
        payment_mode: orderInfo.payment_mode,
        payment_details: orderInfo.payemnt_details,
        bank_reference: orderInfo.bank_reference,
        payment_message: orderInfo.Payment_message,
        status: orderInfo.status,
        error_message: orderInfo.error_message,
        payment_time: orderInfo.payment_time,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { handleWebhook };

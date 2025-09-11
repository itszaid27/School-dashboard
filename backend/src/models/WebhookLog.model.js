const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  payload: { type: Object, required: true }, 
  receivedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('WebhookLog', webhookLogSchema);

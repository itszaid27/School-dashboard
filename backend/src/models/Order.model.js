const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  school_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: true 
},
  trustee_id: { 
    type: String, 
    required: true
},
  student_info: {
    name: String,
    id: String,
    email: String,
  },
  gateway_name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

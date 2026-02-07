const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName:    { type: String, required: true },
  phone:       { type: String, required: true },
  address:     { type: String, required: true },
  serviceType: { type: String, required: true },           
  customService: String,                                   
  dateTime:    { type: Date, required: true },
  paymentType: { type: String, enum: ['наличные', 'карта'], required: true },
  status: {
    type: String,
    enum: ['новая', 'в работе', 'выполнено', 'отменено'],
    default: 'новая'
  },
  cancelReason: String,                                    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
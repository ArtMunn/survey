const mongoose = require('mongoose');

const customerSourceSchema = new mongoose.Schema({
  source: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CustomerSource', customerSourceSchema);

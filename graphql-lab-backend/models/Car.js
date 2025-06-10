const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: String,
  model: String,
});

module.exports = mongoose.model('Car', CarSchema);

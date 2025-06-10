const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: String,
  age: Number,
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
});

module.exports = mongoose.model('Driver', DriverSchema);

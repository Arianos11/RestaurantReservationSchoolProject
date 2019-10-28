const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  tableNumber: {
      type: Number,
      required: [true, "Number is required"],
      unique: [true, "Number must be unique"]
  },
  person: {
    type: Number,
    required: [true, "Number is required"],
  },
  hoursReserved: {
      type: Date
  }

});

module.exports = mongoose.model('Table', tableSchema);
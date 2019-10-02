const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const tableSchema = new Schema({
  tableNumber: {
      Name: Number,
      required: [true, "Number is required"],
      unique: [true, "Number must be unique"]
  },
  person: {
    HowMuch: Number,
    required: [true, "Number is required"],
  },
  hoursReserved: {
      hours: Date
  }

});

module.exports = mongoose.model('Table', tableSchema);
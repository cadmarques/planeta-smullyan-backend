// backend/models/TestDoc.js
const mongoose = require('mongoose');

const testDocSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

module.exports = mongoose.model('TestDoc', testDocSchema);
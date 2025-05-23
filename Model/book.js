/*const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  reserved: { type: Boolean, default: false },
  reservedBy: { type: String, default: '' },
  returnDate: { type: String, default: '' }
});

module.exports = mongoose.model('Book', BookSchema);*/
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  published: { type: Number, required: true },
  reserved: { type: Boolean, default: false },
  reservedBy: { type: String, default: null },
  borrowed: { type: Boolean, default: false },
  borrowedBy: { type: String, default: null },
  borrowDate: { type: Date, default: null }
});

module.exports = mongoose.model('Book', BookSchema);

const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  artist: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  }
});

module.exports = mongoose.model('Music', musicSchema);

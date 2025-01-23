const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
  },
  author: {
    type:"string",
    // type: mongoose.Schema.Types.ObjectId,
    required: true,

  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required:true,
  },
  bookImage:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('Book', bookSchema);

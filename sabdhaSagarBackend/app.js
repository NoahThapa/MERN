const express = require('express')
const app = express();
const cors = require('cors')
require('dotenv').config();
const connectDB =  require("./Config/Db")
app.use(express.json());
const port = process.env.port;
const authRoutes = require("./Routes/api/authRoutes")
const bookRoutes = require("./Routes/api/books")
const wishlistRoutes = require('./Routes/api/wishlistRoutes');
const cartRoutes = require('./Routes/api/cartRoutes')
const contactRoutes = require('./Routes/api/contactRoutes')
const categoryRoutes = require('./Routes/api/categoryRoutes')
// const ProfileRoutes = require('./Routes/api/ProfileRoutes')
const path = require('path');
const orderRoutes = require('./Routes/api/orderRoutes')

app.use(cors())
//

connectDB();
app.use('/auth', authRoutes)
app.use('/book', bookRoutes)
app.use('/wishlist', wishlistRoutes);
app.use('/cart',cartRoutes)
app.use('/contact', contactRoutes)
app.use('/category',categoryRoutes)
app.use('/order',orderRoutes)



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      // Extract the filename from the full path
      book.bookImage = path.basename(book.bookImage);
      res.json(book);
    } else {
      res.status(404).json({ msg: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});






app.listen(port,()=>{
    console.log(`Server is running in ${port}`)
});



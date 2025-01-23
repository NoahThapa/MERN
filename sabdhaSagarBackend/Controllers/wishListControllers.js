const Wishlist = require('../Models/wishListModels');
const Book = require('../Models/bookModels');

const addToWishlist = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the book is already in the user's wishlist
    const existingItem = await Wishlist.findOne({ userId, bookId });
    if (existingItem) {
      return res.status(400).json({ msg: 'Book already in wishlist' });
    }

    const wishlistItem = new Wishlist({ userId, bookId });
    await wishlistItem.save();
    res.json({ msg: 'Book added to wishlist', wishlistItem });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



const getUserWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.find({ userId }).populate('bookId');
    res.json({ wishlist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const removeFromWishlist = async (req, res) => {
  const { id } = req.params;  // This is the bookId
  const userId = req.user.id;

  console.log('Attempting to remove book from wishlist:', { bookId: id, userId });

  try {
    const wishlistItem = await Wishlist.findOneAndDelete({ bookId: id, userId });
    if (!wishlistItem) {
      console.log('Wishlist item not found for', { bookId: id, userId });
      return res.status(404).json({ msg: 'Wishlist item not found' });
    }
    res.json({ msg: 'Book removed from wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


module.exports = {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist
};

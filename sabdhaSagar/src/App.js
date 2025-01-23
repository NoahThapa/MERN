import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Contact from './Components/ContactForm/Contact';
import Register from './Components/Register/Register';
import Books from './Components/Books/Books';
import ProfilePage from './Components/Profile/Profile';
import AddBooksComponent from './Components/AddBooks/AddBooksComponent';
import Category from './Components/Category/Category';
import Footer from './Components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './Components/context/authContext';
import ProtectedRoute from './Components/ProtectedRoute';
import WishlistPage from './Components/WishList/WishlistPage';
import Cart from './Components/Cart/Cart'
import OrderPage from './Components/Order/Order';
import Confirmation from './Components/Order/OrderConfirmationPage'
import AllOrder from './Components/Order/AllOrder'
import OrderHistoryPage from './Components/Order/OrderHistory';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <Navbar />
          <div className='content'>
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/books' element={<Books />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/order-history' element={<OrderHistoryPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/addbook' element={<ProtectedRoute element={<AddBooksComponent />} />} />
              <Route path='/category' element={<ProtectedRoute element={<Category />} />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<OrderPage />} />
              <Route path="/order-confirmation" element={<Confirmation />} />
              <Route path="/all-Order" element={<AllOrder/>} />

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

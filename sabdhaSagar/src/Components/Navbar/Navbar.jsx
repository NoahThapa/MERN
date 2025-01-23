import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/authContext';
import image from '../../images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isLoggedIn, isAdmin, username } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleUserIconClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      // Toggle dropdown when user is logged in
      setIsDropdownOpen(prevState => !prevState);
    } else {
      // Navigate to login page if not logged in
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsDropdownOpen(false);
    navigate('/login');
    window.location.reload(); // Refresh to update auth state
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.icon-button')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md">
      <div className="flex items-center justify-between w-full md:w-1/6">
        <button className="md:hidden text-2xl" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center justify-center w-full md:w-auto mt-4 md:mt-0`}>
        <ul className="flex flex-col md:flex-row gap-4 md:gap-7 text-gray-500 font-bold text-l items-center hover:cursor-pointer">
          <Link to="/" className="hover:scale-105 hover:text-red-500 transition-all hover:border-b border-red-500">HOME</Link>
          <Link to="/books" className="hover:scale-105 hover:text-red-500 transition-all hover:border-b border-red-500">BOOKS</Link>
          <Link to="/">
            <img className="h-8 md:h-24 hover:scale-105 transition-transform" src={image} alt="Logo" />
          </Link>
          {isLoggedIn && (
        <Link to="/order-history" className="hover:scale-105 hover:text-red-500 transition-all hover:border-b border-red-500">
          ORDERS
        </Link>
      )}
          <Link to="/contact" className="hover:scale-105 hover:text-red-500 transition-all hover:border-b border-red-500">CONTACT US</Link>
          {isAdmin && (
            <>
              <Link to="/addbook" className="hover:scale-105 hover:text-red-500 transition-all hover:border-b border-red-500">Add Book</Link>
              <Link to="/category" className="hover:scale-105 hover:text-red-500 transition-all hover:border-b border-red-500">Add Category</Link>
              <Link to="/all-Order" className="hover:scale-105 hover:text-red-500 transition-all hover:border-b border-red-500">All Orders</Link>
            </>
          )}
        </ul>
      </div>
      <div className="relative">
        <button onClick={handleUserIconClick} className="icon-button hover:scale-105 hover:text-red-500 transition-all text-2xl">
          <FontAwesomeIcon icon={faUser} />
          {isLoggedIn && <span className="ml-2 text-lg">{username}</span>}
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-1">
              {isLoggedIn ? (
                <>
                  <li 
                    className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer font-semibold"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer font-semibold"
                    onClick={() => navigate('/cart')}
                  >
                    Cart
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer font-semibold"
                    onClick={() => navigate('/wishlist')}
                  >
                    Wish List
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer font-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </>
              ) : (
                <>
                  <li 
                    className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer font-semibold"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer font-semibold"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

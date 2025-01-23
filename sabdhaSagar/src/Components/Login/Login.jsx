import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formValues, setFormValues] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formValues.username) {
      tempErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formValues.password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (formValues.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (!validationErrors) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/login', formValues);
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful! Redirecting...');

      // Redirect after a short delay to allow the user to see the success message
      setTimeout(() => {
      
        navigate('/books'); 
        window.location.reload('/books');
      }, 1500);
    } catch (error) {
      console.error(error.response?.data?.msg || 'An error occurred'); 
      toast.error(error.response?.data?.msg || 'An error occurred');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className='m-16 gap-2 h-screen flex flex-col'>
        <h2 className='font-serif text-5xl mb-6'>Login</h2>

        <form onSubmit={handleSubmit} className='font-serif gap-3 w-full max-w-md'>
          <div className="mb-5">
            <label htmlFor="username" className='block text-gray-700 font-semibold mb-1'>
              USERNAME
            </label>
            <input
              className='bg-gray-100 px-5 py-3 w-full border border-gray-300 rounded focus:outline focus:outline-red-500'
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder='Username'
            />
            {errors.username && <p className='text-red-600 mt-1'>{errors.username}</p>}
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className='block text-gray-700 font-semibold mb-1'>
              PASSWORD
            </label>
            <input
              className='bg-gray-100 px-5 py-3 w-full border border-gray-300 rounded focus:outline focus:outline-red-500'
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder='Password'
            />
            <span
              className="absolute right-4 top-12 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className='text-red-600 mt-1'>{errors.password}</p>}
          </div>

          <button
            className='bg-red-600 border border-red-600 px-6 py-3 text-white rounded-md font-serif font-bold text-xs hover:bg-white hover:text-red-600 hover:drop-shadow-xl transition-all'
            type='submit'
          >
            LOG IN
          </button>
        </form>

        <Link to='/register' className='font-sans text-red-600 hover:underline mt-4 capitalize'>
          Don't have an account? Register here
        </Link>

        <ToastContainer />
      </div>
    </>
  );
};

export default Login;

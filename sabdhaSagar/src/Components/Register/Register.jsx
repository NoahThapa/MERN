// src/Register.js

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    repassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const validate = () => {
    let isValid = true;
    let errors = {};

    // Full Name
    if (!formValues.fullname) {
      errors.fullname = 'Full name is required.';
      isValid = false;
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email) {
      errors.email = 'Email is required.';
      isValid = false;
    } else if (!emailPattern.test(formValues.email)) {
      errors.email = 'Invalid email format.';
      isValid = false;
    }

    // Username
    if (!formValues.username) {
      errors.username = 'Username is required.';
      isValid = false;
    }

    // Password
    if (!formValues.password) {
      errors.password = 'Password is required.';
      isValid = false;
    } else if (formValues.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    // Retype Password
    if (formValues.password !== formValues.repassword) {
      errors.repassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleValidation = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          'http://localhost:5000/auth/register',
          {
            fullname: formValues.fullname,
            email: formValues.email,
            username: formValues.username,
            password: formValues.password,
          }
        );
        console.log(response);
        toast.success(response.data.msg);

        // Navigate to login page
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        console.error(error.response.data.msg);
        // toast.error(error.response.data.msg);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRepasswordVisibility = () => {
    setShowRepassword(!showRepassword);
  };

  return (
    <div className='m-16 gap-4 h-screen'>
      <h2 className='font-serif text-5xl mb-6'>Register</h2>
      <form className='font-serif gap-3' onSubmit={handleValidation}>
        <ToastContainer />
        <div className="mb-5">
          <label htmlFor="fullname" className='gap-3'>Full Name</label>
          <br />
          <input
            className='bg-gray-100 px-5 py-3 w-2/4 focus:outline focus:outline-red-500'
            type="text"
            id="fullname"
            name="fullname"
            placeholder='Full Name'
            value={formValues.fullname}
            onChange={handleChange}
          />
          {errors.fullname && <p className='text-red-600'>{errors.fullname}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="email" className='gap-3'>Email</label>
          <br />
          <input
            className='bg-gray-100 px-5 py-3 w-2/4 focus:outline focus:outline-red-500'
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            value={formValues.email}
            onChange={handleChange}
          />
          {errors.email && <p className='text-red-600'>{errors.email}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="username" className='gap-3'>Username</label>
          <br />
          <input
            className='bg-gray-100 px-5 py-3 w-2/4 focus:outline focus:outline-red-500'
            type="text"
            id="username"
            name="username"
            placeholder='Username'
            value={formValues.username}
            onChange={handleChange}
          />
          {errors.username && <p className='text-red-600'>{errors.username}</p>}
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className='gap-3'>Password</label>
          <br />
          <input
            className='relative bg-gray-100 px-4 py-3 w-2/4 focus:outline focus:outline-red-500'
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder='Password'
            value={formValues.password}
            onChange={handleChange}
          />
          <div
            className="relative -inset-y-16 -right-1/2 pr-3 items-center text-sm leading-5 mt-8"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaEyeSlash className=" text-gray-500 cursor-pointer" />
            ) : (
              <FaEye className="text-gray-500 cursor-pointer" />
            )}
          </div>
          {errors.password && <p className='text-red-600'>{errors.password}</p>}
        </div>
        <div className="mb-4 relative">
          <label htmlFor="repassword" className='gap-3'>Retype Password</label>
          <br />
          <input
            className='bg-gray-100 px-5 py-3 w-2/4 focus:outline focus:outline-red-500'
            type={showRepassword ? "text" : "password"}
            id="repassword"
            name="repassword"
            placeholder='Retype Password'
            value={formValues.repassword}
            onChange={handleChange}
          />
          <div
            className="relative -inset-y-9 -right-1/2 flex items-center text-sm mt-2"
            onClick={toggleRepasswordVisibility}
          >
            {showRepassword ? (
              <FaEyeSlash className="text-gray-500 cursor-pointer" />
            ) : (
              <FaEye className="text-gray-500 cursor-pointer" />
            )}
          </div>
          {errors.repassword && <p className='text-red-600'>{errors.repassword}</p>}
        </div>
        <div className='flex text-center gap-32'>
        <button
          className='bg-red-600 border border-red-600 px-6 py-4 text-white rounded-md font-serif font-bold text-xs hover:bg-white hover:text-red-600 hover:drop-shadow-xl transition-all'
          type='submit'
        >
          Register
        </button>
        
          <Link 
            to="/login" 
            className='capitalize py-2 text-red-600 cursor-pointer hover:underline hover:text-red-400 transition-all'>
            Already have an account? Login Here
          </Link>

        </div>
        
      </form>
    </div>
  );
};

export default Register;

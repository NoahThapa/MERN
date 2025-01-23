import React, { useState } from 'react';
import axiosInstance from '../../Config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!contactData.name) errors.name = 'Name is required';
    if (!contactData.email) errors.email = 'Email is required';
    if (!contactData.message) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axiosInstance.post('/contact', contactData);
        toast.success('Message sent successfully!');
        setContactData({ name: '', email: '', message: '' });
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
      }
    }
  };

  return (
    <>
      <div className='m-16 gap-4 h-screen'>
        <div>
          <h2 className='font-serif text-5xl mb-6'>Contact Us</h2><br/>
          <form className='font-serif gap-3' onSubmit={handleSubmit}>
            <ToastContainer />
            <div className="mb-5">
              <label htmlFor="name" className='gap-3'>Name</label>
              <br/>
              <input
                className='bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500'
                type="text"
                id="name"
                name="name"
                placeholder='Name'
                value={contactData.name}
                onChange={handleChange}
              />
              {errors.name && <p className='text-red-600'>{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className='gap-3'>Email</label>
              <br/>
              <input
                className='bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500'
                type="email"
                id="email"
                name="email"
                placeholder='Email'
                value={contactData.email}
                onChange={handleChange}
              />
              {errors.email && <p className='text-red-600'>{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="message" className='gap-3'>Message</label>
              <br/>
              <textarea
                className='bg-gray-200 px-5 py-3 w-2/4 h-36 focus:outline focus:outline-red-500'
                id="message"
                name="message"
                placeholder='Message'
                value={contactData.message}
                onChange={handleChange}
              />
              {errors.message && <p className='text-red-600'>{errors.message}</p>}
            </div>
            <button
              className='bg-red-600 border border-red-600 px-6 py-4 text-white rounded-md font-serif font-bold text-xs hover:bg-white hover:text-red-600 hover:drop-shadow-xl transition-all'
              type="submit"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;

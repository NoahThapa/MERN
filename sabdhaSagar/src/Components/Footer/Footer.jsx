import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-2">
      <div className="container mx-auto">
       
        <div className="flex justify-end space-x-4">
        <p className="font-serif italic mb-4">
          © 2024 Sabda Sagar. All Rights Reserved.
        </p>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} className="text-2xl hover:text-red-500 transition-colors" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className="text-2xl hover:text-pink-500 transition-colors" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="text-2xl hover:text-blue-400 transition-colors" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} className="text-2xl hover:text-blue-600 transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// src/BookShowcase.js
import React from 'react';
import background from '../../images/background.png'
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/books'); // Replace with the actual route to the Books component
    };
    return (
        <div id='whole' className='bg-gray-100 h-screen flex '>
          <div id='left' className='w-1/2 m-7'>
          <p className='text-red-500 text-3xl font-serif font-bold m-6  py-3 '>SABDA SAGAR</p>
          <h1 className='font-serif text-6xl m-6'>Meet Your Next Favourite Nepali Books...</h1>
          <img className='h-36' src={background} alt='background'/>
          <button onClick={handleExploreClick} className='bg-red-600 border border-red-600 px-6 py-4 text-white rounded-md font-serif font-bold text-xs hover:bg-white hover:text-red-600 hover:drop-shadow-xl transition-all'>EXPLORE</button>

          </div>
          <div id='right' className='flex justify-center items-center object-center text-center p-10 space-x-6'>
                <img className='h-3/5 hover:scale-150 drop-shadow-lg transition-transform duration-300 skew-y-6 shadow-2xl' src='https://shopratnaonline.com/wp-content/uploads/2022/09/Phulani-Hd.webp' alt='image-1' />
                <img className='h-3/5 hover:scale-150 drop-shadow-lg transition-transform duration-300 shadow-2xl' src='https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2F9789937775380%2F9789937775380-3994.webp&w=3840&q=75' alt='image-2' />
                {/* <img className='h-64 hover:scale-150 drop-shadow-lg transition-transform duration-300' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwhf1jdaWI2WY-hV-bwFRKCURnV243Akhjxg&s' alt='image-3' /> */}
            </div>
        </div>
    );
}

export default HomePage;

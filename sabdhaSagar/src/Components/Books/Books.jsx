import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Config/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../ProductCard/ProductCard';

const SkeletonLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="border p-4 rounded-lg shadow-lg animate-pulse">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-4"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-2"></div>
      </div>
    ))}
  </div>
);

const Books = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortCriteria, setSortCriteria] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axiosInstance.get('/book');
        const categoriesResponse = await axiosInstance.get('/category/all');
        setProducts(productsResponse.data);
        setCategories([{ name: 'All Categories', count: productsResponse.data.length }, ...categoriesResponse.data.categories]);
        setFilteredProducts(productsResponse.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
  
    const filtered = products
      .filter(product => {
        console.log("Product:", product);
        console.log("Product Category:", product.category);
        return selectedCategory === 'All Categories' || product.category === selectedCategory;
      })
      .filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortCriteria === 'title') {
          return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortCriteria === 'price') {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
  
    setFilteredProducts(filtered);
  }, [products, searchTerm, sortOrder, selectedCategory, sortCriteria]);
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    const [criteria, order] = e.target.value.split('-');
    setSortCriteria(criteria);
    setSortOrder(order);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const renderContent = () => {
    if (loading) return <SkeletonLoading />;
    if (error) return <p>Error: {error}</p>;

    return (
      <div className="m-16 gap-4">
        {/* Search and Sort Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full px-7 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
            />
            <FontAwesomeIcon
              className="absolute left-4 top-1/3 transform -translate-x-1/3 text-gray-600"
              icon={faMagnifyingGlass}
            />
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-800 transition duration-300"
            >
              Clear
            </button>
          </div>
          <div className="w-1/4">
            <select
              value={`${sortCriteria}-${sortOrder}`}
              onChange={handleSortOrderChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
            >
              <option value="title-asc">Sort by Title: A to Z</option>
              <option value="title-desc">Sort by Title: Z to A</option>
              <option value="price-asc">Sort by Price: Low to High</option>
              <option value="price-desc">Sort by Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category List */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl mb-4">Product Categories</h2>
          <ul className="flex gap-5 flex-wrap">
            {categories.map((category, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`font-semibold transition duration-300 ${selectedCategory === category.name ? 'text-red-600 underline' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {category.name} <span className="text-gray-500">({category.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return renderContent();
};

export default Books;

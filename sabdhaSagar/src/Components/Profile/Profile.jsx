import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Config/axiosConfig';

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      console.log('API Response:', response.data);
      setUserData(response.data);
      setFormData({
        fullname: response.data.fullname || '',
        email: response.data.email || '',
      });
    } catch (error) {
      setError('Error fetching user data.');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/auth/', formData);
      setUserData(response.data);
      setEditMode(false);
    } catch (error) {
      setError('Error updating user data.');
      console.error('Error updating user data:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-6"><p>{error}</p></div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Profile</h2>
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-lg font-medium mb-1">Name:</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-lg">Name: {userData.fullname || 'N/A'}</p>
              <p className="text-lg">Email: {userData.email || 'N/A'}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from "react";
import axiosInstance from "../../Config/axiosConfig";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category/all");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await axiosInstance.patch(
          `/category/update/${editingCategory._id}`,
          newCategory
        );
        toast.success(response.data.msg);
        setEditingCategory(null);
      } else {
        const response = await axiosInstance.post(
          "/category/create",
          newCategory
        );
        toast.success(response.data.msg);
      }
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const handleEdit = (category) => {
    setNewCategory({ name: category.name, description: category.description });
    setEditingCategory(category);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/category/delete/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg);
      fetchCategories();
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <div className="m-16 gap-4">
      <ToastContainer />
      <h2 className="font-serif text-5xl mb-6">Manage Categories</h2>
      <form onSubmit={handleSubmit} className="font-serif gap-3 mb-10">
        <div className="mb-5">
          <label htmlFor="name" className="gap-3 text-lg">Category Name</label>
          <br />
          <input
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded"
            type="text"
            id="name"
            name="name"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="gap-3 text-lg">Category Description</label>
          <br />
          <textarea
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded h-36"
            id="description"
            name="description"
            placeholder="Category Description"
            value={newCategory.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-red-600 border border-red-600 px-6 py-4 text-white rounded-md font-serif font-bold text-xs hover:bg-white hover:text-red-600 hover:drop-shadow-xl transition-all"
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </button>
      </form>
      <div className="font-serif">
        <h3 className="text-3xl mb-5">Category List</h3>
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center p-4 border-b border-gray-300 shadow-md rounded-md"
            >
              <div>
                <h4 className="text-2xl font-semibold">{category.name}</h4>
                <p className="text-gray-600">{category.description}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleEdit(category)}
                  className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <AiFillEdit size={24} />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <AiFillDelete size={24} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryComponent;

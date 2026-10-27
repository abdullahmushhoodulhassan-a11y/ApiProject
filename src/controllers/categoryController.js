const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../config/db');

const getCategories = (req, res) => {
  const categories = readData('categories');
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
};

const getCategoryById = (req, res) => {
  const categories = readData('categories');
  const category = categories.find((c) => c.id === req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: `Category not found with id: ${req.params.id}`
    });
  }

  res.status(200).json({ success: true, data: category });
};

const createCategory = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Category name is required'
    });
  }

  const categories = readData('categories');
  const newCategory = {
    id: uuidv4(),
    name,
    description: description || '',
    createdAt: new Date().toISOString()
  };

  categories.push(newCategory);
  writeData('categories', categories);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: newCategory
  });
};

const updateCategory = (req, res) => {
  const categories = readData('categories');
  const index = categories.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Category not found with id: ${req.params.id}`
    });
  }

  const { name, description } = req.body;
  categories[index] = {
    ...categories[index],
    name: name || categories[index].name,
    description: description !== undefined ? description : categories[index].description,
    updatedAt: new Date().toISOString()
  };

  writeData('categories', categories);

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: categories[index]
  });
};

const deleteCategory = (req, res) => {
  const categories = readData('categories');
  const filtered = categories.filter((c) => c.id !== req.params.id);

  if (filtered.length === categories.length) {
    return res.status(404).json({
      success: false,
      message: `Category not found with id: ${req.params.id}`
    });
  }

  writeData('categories', filtered);
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

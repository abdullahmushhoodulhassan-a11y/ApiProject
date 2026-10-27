const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../config/db');

const getCourses = (req, res) => {
  const courses = readData('courses');
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
};

const getCourseById = (req, res) => {
  const courses = readData('courses');
  const course = courses.find((c) => c.id === req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: `Course not found with id: ${req.params.id}`
    });
  }

  res.status(200).json({ success: true, data: course });
};

const createCourse = (req, res) => {
  const { title, description, price, categoryId } = req.body;

  if (!title || price === undefined || !categoryId) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: title, price, and categoryId are required'
    });
  }

  const categories = readData('categories');
  const categoryExists = categories.some((c) => c.id === categoryId);
  if (!categoryExists) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: categoryId does not match any existing category'
    });
  }

  const courses = readData('courses');
  const newCourse = {
    id: uuidv4(),
    title,
    description: description || '',
    price: Number(price),
    categoryId,
    createdAt: new Date().toISOString()
  };

  courses.push(newCourse);
  writeData('courses', courses);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse
  });
};

const updateCourse = (req, res) => {
  const courses = readData('courses');
  const index = courses.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Course not found with id: ${req.params.id}`
    });
  }

  const { title, description, price, categoryId } = req.body;

  courses[index] = {
    ...courses[index],
    title: title || courses[index].title,
    description: description !== undefined ? description : courses[index].description,
    price: price !== undefined ? Number(price) : courses[index].price,
    categoryId: categoryId || courses[index].categoryId,
    updatedAt: new Date().toISOString()
  };

  writeData('courses', courses);

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: courses[index]
  });
};

const deleteCourse = (req, res) => {
  const courses = readData('courses');
  const filtered = courses.filter((c) => c.id !== req.params.id);

  if (filtered.length === courses.length) {
    return res.status(404).json({
      success: false,
      message: `Course not found with id: ${req.params.id}`
    });
  }

  writeData('courses', filtered);
  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};

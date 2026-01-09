import Category from '../models/category.model.js';
import slugify from 'slugify';

export const createCategory = async (req, res, next) => {
  try {
    const { name, defaultPhone, defaultAddress, defaultPhotos = [], defaultPrice = 0, description = '' } = req.body;
    const slug = slugify(name || Date.now().toString(), { lower: true, strict: true });

    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) return res.status(409).json({ success: false, message: 'Category already exists' });

    const category = await Category.create({ name, slug, defaultPhone, defaultAddress, defaultPhotos, defaultPrice, description });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
import express from 'express';
import * as categoryCtrl from '../controllers/category.controller.js';

const router = express.Router();

router.post('/', categoryCtrl.createCategory);
router.get('/', categoryCtrl.getCategories);
router.get('/:id', categoryCtrl.getCategoryById);
router.put('/:id', categoryCtrl.updateCategory);
router.delete('/:id', categoryCtrl.deleteCategory);

export default router;
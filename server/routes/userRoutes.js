import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
} from '../controllers/userController.js';
import { authorizeRoles } from '../middleware/authorization.js';
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);
router.put('/:id', updateUser);

export default router;
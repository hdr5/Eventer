import express from 'express';
import { login, register, logout, getSession, updateProfile, addFavorite, removeFavorite } from '../controllers/authController.js';
import { authentication } from '../middleware/authentication.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/session', authentication, getSession);
router.put('/profile', authentication, updateProfile);
router.post('/me/favorites/:eventId', authentication, addFavorite);
router.delete('/me/favorites/:eventId', authentication, removeFavorite);

// router.get('/cities', fetchCities);


export default router;
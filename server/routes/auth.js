import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import generateJwt from '../utils/jwt-utils.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, generateJwt);

    return res.status(200).json({ token });

})

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
    }
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    if (password.length < 2) {
        return res.status(400).json({ message: 'Password must be at least 2 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, generateJwt);
    res.status(201).json({ message: 'User registered successfully', token })
})


export default router;
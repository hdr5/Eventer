import express from 'express';
import User from '../models/user.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { notifyClients } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
});

router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role
    });
    await newUser.save();

    notifyClients({
        type: 'NEW_USER',
        // user: newUser
    });

    res.status(201).json({ message: 'User created successfully' });

});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    
    notifyClients({
        type: 'USER_DELETED'
    });

    res.status(200).json({ message: 'User delete successfully' });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const convertedId = new mongoose.Types.ObjectId(id);

    const updatedUser = await User.findByIdAndUpdate(convertedId, {
        name,
        email,
        password: hashedPassword,
        role,
        updatedAt: new Date()
    });
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    else { return res.status(200).json({ message: 'User updated successfully' }); }

});

export default router;

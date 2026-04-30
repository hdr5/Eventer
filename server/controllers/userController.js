import User from '../models/user.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { notifyClients } from '../server.js';
import Event from '../models/event.js';


export const getAllUsers = async (req, res) => {
    // const users = await User.find();
    const users = await User.find().select('-password');
    res.status(200).json(users);
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    // const user = await User.findById(id);
    const user = await User.findById(id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // notifyClients({ type: 'NEW_USER' });
        notifyClients({
            type: 'NEW_USER',
            payload: {
                userId: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    notifyClients({ type: 'USER_DELETED' });

    res.status(200).json({ message: 'User deleted successfully' });
};

export const updateUser = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const updateFields = {};

        if (name !== undefined) updateFields.name = name;
        if (email !== undefined) updateFields.email = email;
        if (role !== undefined) updateFields.role = role;

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
// export const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, email, password, role } = req.body;
//         console.log('name: ', name);

//         // Validate ObjectId
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: 'Invalid user ID' });
//         }

//         // const convertedId = new mongoose.Types.ObjectId(id);

//         // Prepare update fields
//         const updateFields = { name, email, role, updatedAt: new Date() };

//         // Only hash password if provided
//         if (password) {
//             updateFields.password = await bcrypt.hash(password, 10);
//         }
//         if (req.user.role !== 'admin') {
//             delete updateFields.role; // לא לאפשר שינוי role אם המשתמש לא אדמין
//         }

//         // Update the user
//         const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         return res.status(200).json(updatedUser);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
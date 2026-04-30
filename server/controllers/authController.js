
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
// import generateJwt from '../utils/jwt-utils.js';
import jwtSecret from '../utils/jwt-utils.js';

// export const login = async (req, res) => {
// try {
// const { email, password } = req.body;

// const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
// if (!user) {
// return res.status(404).json({ message: 'User not found' });
// }
// const isPasswordValid = await bcrypt.compare(password, user.password);
// if (!isPasswordValid) {
// return res.status(401).json({ message: 'Incorrect password' });
// }

// const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '3h' });
// res.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 3600000 });

// return res.status(200).json({ token, user });
// } catch (error) {
// console.error('Error in login:', error);
// return res.status(500).json({ message: 'Internal Server Error' });
// }
// };
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email: new RegExp(`^${email}$`, 'i')
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "3h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      sameSite: "strict",
      maxAge: 3 * 60 * 60 * 1000
    });

    res.status(200).json({
      token,
      user
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 2 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '3h' });
    res.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 3600000 });

    return res.status(201).json({ message: 'Success!', token, user });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'strict' });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getSession = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const safeUser = { ...user.toObject(), password: undefined };

    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Error in getSession:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// export const updateProfile = async (req, res) => {
// try {
// const userId = req.user.id;

// const allowedFields = ['name', 'email', 'avatarUrl'];
// const updates = {};

// // whitelist – רק שדות שמותר לעדכן
// allowedFields.forEach((field) => {
// if (req.body[field] !== undefined) {
// updates[field] = req.body[field];
// }
// });

// if (Object.keys(updates).length === 0) {
// return res.status(400).json({ message: 'No valid fields to update' });
// }

// // אימות אימייל אם קיים
// if (updates.email) {
// const emailExists = await User.findOne({
// email: updates.email,
// _id: { $ne: userId },
// });

// if (emailExists) {
// return res.status(409).json({ message: 'Email already in use' });
// }
// }

// const updatedUser = await User.findByIdAndUpdate(
// userId,
// updates,
// { new: true, runValidators: true }
// ).select('-password');

// res.status(200).json({ user: updatedUser });
// } catch (error) {
// console.error('Update profile error:', error);
// res.status(500).json({ message: 'Failed to update profile' });
// }
// };
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const allowedFields = ['name', 'email', 'avatarUrl'];

    // בונה אובייקט עדכונים רק מהשדות המותרים
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    // בדיקת אימייל כפול
    if (updates.email) {
      const emailExists = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });

      if (emailExists) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ user: updatedUser });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user?.favoriteEvents.includes(eventId)) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    user?.favoriteEvents.push(eventId);
    await user.save();

    res.status(200).json({ favoriteEvents: user?.favoriteEvents });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteEvents: eventId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ favoriteEvents: user?.favoriteEvents });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};

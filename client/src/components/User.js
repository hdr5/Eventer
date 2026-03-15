import React, { useState } from "react";
import "../assets/styles/userStyle.scss";

const UserCard = ({ user, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onUpdate(user._id, editedUser); // ✅ Best practice: Pass `userId` & `updatedUser`
        setIsEditing(false);
    };

    return (
        <li className="user-card">
            {isEditing ? (
                <>
                    <input type="text" name="name" value={editedUser.name} onChange={handleChange} />
                    <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
                    <select name="role" value={editedUser.role} onChange={handleChange}>
                        <option value="Admin">Admin</option>
                        <option value="Producer">Producer</option>
                        <option value="Guest">Guest</option>
                    </select>
                    <div className="user-card__actions">
                        <button onClick={handleSubmit}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <p className="user-card__role">{user.role}</p>
                    <h3 className="user-card__name">{user.name}</h3>
                    <p className="user-card__email">Email: {user.email}</p>
                    <div className="user-card__actions">
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(user._id)}>Delete</button>
                    </div>
                </>
            )}
        </li>
    );
};

export default UserCard;
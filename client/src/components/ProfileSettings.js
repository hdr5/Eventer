import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../assets/styles/profileSettings.scss";
import EditIcon from "@mui/icons-material/Edit";
import { uploadImage } from "../features/upload/uploadActions";
import { updateProfile } from "../features/auth/authActions";


const ProfileSettings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const user = useSelector((state) => state.auth.currentUser);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  if (!user) return null;

  const avatarUrl = user.avatarUrl ? user.avatarUrl : "/default-avatar.png";

  const startEdit = (field, value) => {
    setEditField(field);
    setTempValue(value);
  };
const saveEdit = async () => {
  if (tempValue.trim() === "") return; // לא מאפשר ערכים ריקים

  // מחכים שה־dispatch יסיים ואז מעדכנים את ה־state
  const resultAction = await dispatch(updateProfile({ [editField]: tempValue.trim() }));

  if (updateProfile.fulfilled.match(resultAction)) {
    // עדכון ה־state מיידי ב־Redux
    setEditField(null);
  } else {
    console.error('Failed to update profile:', resultAction.payload);
  }
};
  // const saveEdit = () => {
  //   if (tempValue.trim() === "") return; // לא מאפשר ערכים ריקים
  //   dispatch(updateProfile({ [editField]: tempValue.trim() }));
  //   setEditField(null);
  // };
// const saveEdit = () => {
//   if (tempValue.trim() === "") return; 
//   dispatch(updateProfile({ [editField]: tempValue.trim() }))
//     .unwrap() // optional: unwrap the result if you want to do something after success
//     .then(() => setEditField(null)); // רק אחרי העדכון סגר את ה-edit
// };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(
        uploadImage({
          file,
          target: "avatar",
          id: user._id,
        })
      );
    }
  };

  const renderRow = (label, field, value) => (
    <div className="info-row">
      <span className="row-label">{label}</span>

      {editField === field ? (
        <div className="edit-inline">
          <input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <button className="save-btn" onClick={saveEdit}>Save</button>
          <button className="cancel-btn" onClick={() => setEditField(null)}>Cancel</button>
        </div>
      ) : (
        <div className="row-value" onClick={() => startEdit(field, value)}>
          <span>{value}</span>
          <span className="arrow">›</span>
        </div>
      )}
    </div>
  );

  return (
    // <div className="page">
    <div className="settings-container">
      <section className="section">
        <div className="avatar-section">
          <img src={avatarUrl} alt="avatar" className="avatar-img" />
          <div
            className="avatar-overlay"
            onClick={() => fileInputRef.current?.click()}
          >
            <EditIcon />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        <h3>Basic Info</h3>
        {renderRow("Name", "name", user.name)}
        {renderRow("Email", "email", user.email)}
      </section>
    </div>
    // {/* </div> */}
  );
};

export default ProfileSettings;

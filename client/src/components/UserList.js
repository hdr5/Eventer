// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Formik } from "formik";
// import * as Yup from "yup";

// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   TableSortLabel, TextField, Pagination, Button, CircularProgress, Alert,
//   ToggleButton, ToggleButtonGroup
// } from "@mui/material";

// import "../assets/styles/userListStyle.scss";
// import { deleteUser, fetchUsers, updateUser } from "../features/user/userActions";
// import UserCard from "./User";
// import excelIcon from '../assets/xl.png';
// import pdfIcon from '../assets/pdf.png';

// import { exportUsersToExcel } from '../utils/exportUsersToExcel';
// import { exportUsersToPDF } from "../utils/exportUsersToPDF";


// const UserList = () => {
//   const dispatch = useDispatch();
//   const { users, status, error } = useSelector(state => state.user);
//   const user = useSelector((state) => state.auth.user);    // State
//   const [viewMode, setViewMode] = useState("cards");
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [page, setPage] = useState(1);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editedUser, setEditedUser] = useState({});
//   const rowsPerPage = 10;

//   // Fetch users on mount
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Delete User
//   const handleDelete = useCallback(async (userId) => {
//     const isConfirmed = window.confirm("Are you sure you want to delete this user?");
//     if (isConfirmed) {
//       await dispatch(deleteUser(userId));
//       dispatch(fetchUsers()); // Ensure UI updates immediately
//     }
//   }, [dispatch]);

//   // Edit User
//   const handleEdit = (user) => {
//     setEditingUserId(user._id);
//     setEditedUser(user);
//   };

//   // Update User
//   const handleUpdate = useCallback(async (userId, updatedUser) => {

//     await dispatch(updateUser({ userId, editedUser: updatedUser }));  // ✅ Corrected Redux update call
//     //    await dispatch(fetchUsers()); // 🔁 refetch to show updated data
//     // setEditingUserId(null);
//   }, [dispatch]);

//   // Cancel Editing
//   const handleCancelEdit = () => {
//     setEditingUserId(null);
//   };

//   // Handle Sorting
//   const handleSort = (field) => {
//     setSortOrder(sortBy === field && sortOrder === "asc" ? "desc" : "asc");
//     setSortBy(field);
//   };

//   const handleChange = useCallback((e) => {
//     setEditedUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   }, []);

//   // Filtering & Sorting
//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(search.toLowerCase()) ||
//     user.email.toLowerCase().includes(search.toLowerCase()) ||
//     user.role.toLowerCase().includes(search.toLowerCase())
//   );

//   const sortedUsers = [...filteredUsers].sort((a, b) => {
//     if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
//     if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
//     return 0;
//   });

//   const paginatedUsers = sortedUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

//   // Loading & Error States
//   if (status === "loading") return <CircularProgress />;
//   if (status === "failed") return <Alert severity="error">{error}</Alert>;

//   return (
//     <>
//       <div className="user-list-container">
//         {/* Toggle View Mode */}

//         <diV className="user-list-header">
//           <div className="toggle-buttons">
//             <button
//               className={viewMode === "cards" ? "active" : ""}
//               onClick={() => setViewMode("cards")}
//             >
//               Cards View
//             </button>
//             <button
//               className={viewMode === "table" ? "active" : ""}
//               onClick={() => setViewMode("table")}
//             >
//               Table View
//             </button>
//           </div>
//           <div>      <button className="excel-button" onClick={() => exportUsersToExcel(users)}>
//             <img src={excelIcon} alt="Excel Icon" className="icon" />
//           </button>                                    <button className="pdf-button" onClick={() => exportUsersToPDF(users, user.name)}>
//               <img src={pdfIcon} alt="Pdf Icon" className="icon" />
//             </button></div>
//         </diV>
//         {/* Search Box */}

//         <TextField label="Search Users" fullWidth margin="normal"
//           onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
//         <div className="content">
//           {/* Table View */}
//           {viewMode === "table" ? (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     {['name', 'email', 'role'].map((field) => (
//                       <TableCell key={field}>
//                         <TableSortLabel
//                           active={sortBy === field}
//                           direction={sortBy === field ? sortOrder : "asc"}
//                           onClick={() => handleSort(field)}
//                         >
//                           {field.charAt(0).toUpperCase() + field.slice(1)}
//                         </TableSortLabel>
//                       </TableCell>
//                     ))}
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {paginatedUsers.map((user) => (
//                     <TableRow key={user._id}>
//                       {editingUserId === user._id ? (
//                         <Formik
//                           initialValues={{
//                             name: user.name,
//                             email: user.email,
//                             role: user.role,
//                           }}
//                           validationSchema={Yup.object({
//                             name: Yup.string().required("Name is required"),
//                             email: Yup.string().email("Invalid email").required("Email is required"),
//                             role: Yup.string().oneOf(["Admin", "Producer", "Guest"]).required("Role is required"),
//                           })}
//                           onSubmit={(values) => {
//                             handleUpdate(user._id, values);
//                           }}
//                         >
//                           {(formik) => (
//                             <>
//                               <TableCell>
//                                 <TextField
//                                   name="name"
//                                   value={formik.values.name}
//                                   onChange={formik.handleChange}
//                                   error={formik.touched.name && Boolean(formik.errors.name)}
//                                   helperText={formik.touched.name && formik.errors.name}
//                                   size="small"
//                                 />
//                               </TableCell>
//                               <TableCell>
//                                 <TextField
//                                   name="email"
//                                   value={formik.values.email}
//                                   onChange={formik.handleChange}
//                                   error={formik.touched.email && Boolean(formik.errors.email)}
//                                   helperText={formik.touched.email && formik.errors.email}
//                                   size="small"
//                                 />
//                               </TableCell>
//                               <TableCell>
//                                 <TextField
//                                   name="role"
//                                   select
//                                   SelectProps={{ native: true }}
//                                   value={formik.values.role}
//                                   onChange={formik.handleChange}
//                                   error={formik.touched.role && Boolean(formik.errors.role)}
//                                   helperText={formik.touched.role && formik.errors.role}
//                                   size="small"
//                                 >
//                                   <option value="Admin">Admin</option>
//                                   <option value="Producer">Producer</option>
//                                   <option value="Guest">Guest</option>
//                                 </TextField>
//                               </TableCell>
//                               <TableCell>
//                                 <Button onClick={formik.handleSubmit}>Save</Button>
//                                 <Button onClick={handleCancelEdit}>Cancel</Button>
//                               </TableCell>
//                             </>
//                           )}
//                         </Formik>
//                       ) : (
//                         <>
//                           <TableCell>{user.name}</TableCell>
//                           <TableCell>{user.email}</TableCell>
//                           <TableCell>{user.role}</TableCell>
//                           <TableCell>
//                             <Button onClick={() => handleEdit(user)}>Edit</Button>
//                             <Button onClick={() => handleDelete(user._id)}>Delete</Button>
//                           </TableCell>
//                         </>
//                       )}
//                     </TableRow>

//                     // <TableRow key={user._id}>
//                     //     <TableCell>{editingUserId === user._id ? <input type="text" name="name" value={editedUser.name} onChange={handleChange} /> : user.name}</TableCell>
//                     //     <TableCell>{editingUserId === user._id ? <input type="email" name="email" value={editedUser.email} onChange={handleChange} /> : user.email}</TableCell>
//                     //     <TableCell>
//                     //         {editingUserId === user._id ? <select name="role" value={editedUser.role} onChange={handleChange}><option value="Admin">Admin</option><option value="Producer">Producer</option><option value="Guest">Guest</option></select> : user.role}
//                     //     </TableCell>
//                     //     <TableCell>{editingUserId === user._id ? <><Button onClick={() => handleUpdate(user._id, editedUser)}>Save</Button><Button onClick={handleCancelEdit}>Cancel</Button></> : <Button onClick={() => handleEdit(user)}>Edit</Button>}<Button onClick={() => handleDelete(user._id)}>Delete</Button></TableCell>
//                     // </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <div className="user-grid">{paginatedUsers.map((user) => <UserCard key={user._id} user={user} onDelete={handleDelete} onUpdate={handleUpdate} />)}</div>
//           )}
//         </div>
//         {/* Pagination */}
//         <Pagination
//           count={Math.ceil(filteredUsers.length / rowsPerPage)}
//           page={page}
//           onChange={(e, value) => setPage(value)}
//           className="pagination"
//         />
//       </div>

//     </>
//   );
// };

// export default UserList;

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TableSortLabel, Pagination, Button,
  CircularProgress, Alert
} from "@mui/material";

import "../assets/styles/userListStyle.scss";

import { deleteUser, fetchUsers, updateUser } from "../features/user/userActions";

import UserCard from "./User";

import excelIcon from '../assets/xl.png';
import pdfIcon from '../assets/pdf.png';

import { exportUsersToExcel } from '../utils/exportUsersToExcel';
import { exportUsersToPDF } from "../utils/exportUsersToPDF";

const UserList = () => {

  const dispatch = useDispatch();

  const { users, status, error } = useSelector(state => state.user);
  const currentUser = useSelector((state) => state.auth.user);

  const [viewMode, setViewMode] = useState("cards");

  const [filters, setFilters] = useState({
    search: "",
    role: ""
  });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    order: "asc"
  });

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  /* ---------------- DELETE USER ---------------- */

  const handleDelete = useCallback(async (userId) => {

    const confirmed = window.confirm("Delete this user?");

    if (confirmed) {
      await dispatch(deleteUser(userId));
      dispatch(fetchUsers());
    }

  }, [dispatch]);

  /* ---------------- EDIT USER ---------------- */

  const handleEdit = (user) => {
    setEditingUserId(user._id);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleUpdate = async (userId, values) => {

    await dispatch(updateUser({ userId, editedUser: values }));

    setEditingUserId(null);

  };

  /* ---------------- FILTERS ---------------- */

  const handleFilterChange = (e) => {

    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    setPage(1);

  };

  /* ---------------- SORT ---------------- */

  const handleSort = (field) => {

    setSortConfig(prev => ({
      key: field,
      order: prev.key === field && prev.order === "asc" ? "desc" : "asc"
    }));

  };

  /* ---------------- FILTER USERS ---------------- */

  const filteredUsers = users.filter(user => {

    const searchMatch =
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    const roleMatch =
      filters.role === "" || user.role === filters.role;

    return searchMatch && roleMatch;

  });

  /* ---------------- SORT USERS ---------------- */

  const sortedUsers = [...filteredUsers].sort((a, b) => {

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;

    return 0;

  });

  /* ---------------- PAGINATION ---------------- */

  const paginatedUsers = sortedUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ---------------- STATUS ---------------- */

  if (status === "loading") return <CircularProgress />;
  if (status === "failed") return <Alert severity="error">{error}</Alert>;

  /* ===================================================== */

  return (

    <div className="user-list-container">

      {/* HEADER */}
      <div className="user-list-header">

        <div className="toggle-buttons">
          <button
            className={viewMode === "cards" ? "active" : ""}
            onClick={() => setViewMode("cards")}
          >
            Cards View
          </button>
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
        </div>

        <div>
          <button
            className="excel-button"
            onClick={() => exportUsersToExcel(users)}
          >
            <img src={excelIcon} alt="excel" className="icon" />
          </button>
          <button
            className="pdf-button"
            onClick={() => exportUsersToPDF(users, currentUser.name)}
          >
            <img src={pdfIcon} alt="pdf" className="icon" />
          </button>
        </div>

      </div>

      {/* FILTER BAR */}

      <div className="filter-section">

        <input
          type="text"
          name="search"
          placeholder="Search name or email..."
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="producer">Producer</option>
          <option value="guest">Guest</option>
        </select>

      </div>

      {/* CONTENT */}

      <div className="content">

        {viewMode === "table" ? (

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  {["name", "email", "role"].map(field => (

                    <TableCell key={field}>

                      <TableSortLabel
                        active={sortConfig.key === field}
                        direction={sortConfig.order}
                        onClick={() => handleSort(field)}
                      >

                        {field.toUpperCase()}

                      </TableSortLabel>

                    </TableCell>

                  ))}

                  <TableCell>Actions</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {paginatedUsers.map(user => (

                  <TableRow key={user._id}>

                    {editingUserId === user._id ? (

                      <Formik

                        initialValues={{
                          name: user.name,
                          email: user.email,
                          role: user.role
                        }}

                        validationSchema={Yup.object({

                          name: Yup.string().required("Required"),

                          email: Yup.string()
                            .email("Invalid email")
                            .required("Required"),

                          role: Yup.string()
                            .oneOf(["admin", "producer", "guest"])
                            .required("Required")

                        })}

                        onSubmit={(values) => {
                          handleUpdate(user._id, values);
                        }}

                      >

                        {(formik) => (

                          <>

                            <TableCell>

                              <input
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                              />

                            </TableCell>

                            <TableCell>

                              <input
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                              />

                            </TableCell>

                            <TableCell>

                              <select
                                name="role"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                              >

                                <option value="admin">Admin</option>
                                <option value="producer">Producer</option>
                                <option value="guest">Guest</option>

                              </select>

                            </TableCell>

                            <TableCell>

                              <Button onClick={formik.handleSubmit}>
                                Save
                              </Button>

                              <Button onClick={handleCancelEdit}>
                                Cancel
                              </Button>

                            </TableCell>

                          </>

                        )}

                      </Formik>

                    ) : (

                      <>

                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>

                        <TableCell>

                          <Button onClick={() => handleEdit(user)}>
                            Edit
                          </Button>

                          <Button
                            color="error"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </Button>

                        </TableCell>

                      </>

                    )}

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        ) : (

          <div className="user-grid">

            {paginatedUsers.map(user => (

              <UserCard
                key={user._id}
                user={user}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />

            ))}

          </div>

        )}

      </div>

      {/* PAGINATION */}

      <Pagination
        count={Math.ceil(filteredUsers.length / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        className="pagination"
      />

    </div>

  );

};

export default UserList;
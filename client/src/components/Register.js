import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../assets/styles/registerForm.scss';
import { useDispatch } from 'react-redux';
import { addUser } from '../features/user/userActions';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../features/auth/authActions';

const RegisterForm = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters long')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
    }),
    onSubmit: async(values) => {
      dispatch(registerUser(values));
      navigate('/');
      alert('Registration Successful!');
    },
  });

  return (
    <div className="form">
      <form onSubmit={formik.handleSubmit} className="form-card">
             <h1 className="form-card__title">Register</h1>
        <div className="form-card__group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className={formik.touched.name && formik.errors.name ? 'error-input' : ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error-message">{formik.errors.name}</div>
          )}
        </div>

        <div className="form-card__group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={formik.touched.email && formik.errors.email ? 'error-input' : ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}
        </div>

        <div className="form-card__group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className={formik.touched.password && formik.errors.password ? 'error-input' : ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className="button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../assets/styles/registerForm.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authActions';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();
  const { error, status } = useSelector((state) => state.auth);


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
    }),
    onSubmit: async(values) => {
    const result = await dispatch(loginUser(values));

  if (loginUser.fulfilled.match(result)) {
    navigate('/');
  }
    },
  });

  return (
    <div className="form">

      <form onSubmit={formik.handleSubmit} className="form-card">
        <h1 className="form-card__title">Login</h1>
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
       onChange={(e) => {
    formik.handleChange(e);
    if (error) {
      // clear the error from Redux
      dispatch({ type: "auth/clearError" });
    }
  }}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className="button">Login</button>
         {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default SignInForm;
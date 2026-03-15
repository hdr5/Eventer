// import logo from './logo.svg';
import logo from './assets/logoOrange.png';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import EventPage from './pages/EventPage';
import UserPage from './pages/UserPage';
import Homepage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import RegisterForm from './components/Register';
import SignInForm from './components/SignIn';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import CreateEventForm from './components/EventForm';
import { fetchUser, logout } from './features/auth/authActions';
import { useEffect, useState } from 'react';
import EventDetails from './pages/EventDetailsPage';
import { getNames } from 'countries-list';
import { fetchTLV } from './features/events/eventActions';
import ProfileSettings from './components/ProfileSettings';
import { fetchUserData } from './features/user/userActions';
import NotificationList from './components/NotificationList';
import NotificationToast from './components/NotificationToast';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.currentUser);
  const status = useSelector(state => state.auth.status);
  useEffect(() => {

    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className='App'>
        <Header logo={logo} />
        <div className='main'>
          <NotificationToast />
          <Routes>
            <Route path="/" element={<Homepage user={user} />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/event/:id" element={<EventDetails user={user} />} />
            <Route path="/users" element={<UserPage />} />
            <Route path='/addEvent' element={<CreateEventForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<SignInForm />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/notifications" element={<NotificationList />} />
          </Routes>
        </div>
        <footer className="footer">
          <div className="footer-top">
            <h3>EVENTER</h3>
            <div className="links">
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </div>
          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} EVENTER. All rights reserved.
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
};

export default App;
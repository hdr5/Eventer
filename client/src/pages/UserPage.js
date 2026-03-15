import React from 'react';
import UserList from '../components/UserList.js';

const UserPage = () => {
    return (
        <div className="page-wrapper">
            <header className="page-header">
                <h1>Users</h1>
                <p>Browse through our upcoming events and activities.</p>
            </header>
            <main className="page-content">
                <UserList />
            </main>
         </div>
    );
};

export default UserPage;

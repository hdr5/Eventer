import React from 'react';
import EventList from '../components/EventList';

const EventPage = () => {
    return (
        <div className="page-wrapper">
        <div className="page">
            <header className="page-header">
                <h1>Events</h1>
                <p>Browse through our upcoming events and activities.</p>
            </header>
            <main className="page-content">
                <EventList />
            </main>
        </div>
           </div>
    );
};

export default EventPage;

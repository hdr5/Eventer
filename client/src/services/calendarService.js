// calendarService.js
import axios from 'axios';

const calendarApi = axios.create({
  baseURL: 'http://localhost:5000/calendar',
  withCredentials: true,
});

export const addEventToCalendar = async (event) => {
  console.log('************addEventToCalendar');
  try {
    const response = await calendarApi.post('/addEvent', event, {
      withCredentials: true // מאפשר שליחת cookies
    });
    return response.data;
  } catch (err) {
    console.error('Failed to add event to calendar', err);
    throw err;
  }
};

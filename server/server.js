//cannot use import outside modules
import mongoose from 'mongoose';
import express from 'express';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js'
import cors from 'cors';
import { WebSocket, WebSocketServer } from 'ws';

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/event-managment');

//Allow all the domains -- just for dev
app.use(cors());

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter)
app.use('/api/events', eventsRouter);

const server = app.listen(3003, () => {
    console.log('http://localhost:3003');
});

// יצירת WebSocket server על גבי השרת
const wss = new WebSocketServer({ server });

// מאזין להתחברויות WebSocket
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    // אפשר להוסיף פה שליחה של המידע הראשוני ללקוח (למשל רשימת משתמשים או כל מידע אחר)
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'WebSocket Connected' }));

    // אפשר להאזין להודעות מהלקוח אם יש צורך
    ws.on('message', (message) => {
        console.log('Message from client: ', message);
    });

    // סגירת החיבור
    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });
});

// פונקציה ששולחת עדכונים ללקוחות המחוברים
export const notifyClients = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};


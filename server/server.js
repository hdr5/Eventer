import mongoose from 'mongoose';
import express from 'express';
import uploadRouter from './routes/uploadRoutes.js';
import usersRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import eventsRouter from './routes/eventRoutes.js'
import registrationRouter from './routes/registrationRoutes.js'
import notificationRouter from "./routes/notificationRoutes.js";
import locationRouter from "./routes/locationRoutes.js";

import cors from 'cors';
import { WebSocket, WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { authentication } from './middleware/authentication.js';
import { authorizeRoles } from './middleware/authorization.js';

dotenv.config();

const app = express();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        //  למפתחים - שליחת התראה
        // sendErrorNotification(`MongoDB Connection Failed: ${error.message}`);

        process.exit(1); // stop app if DB is not available
    }
};
const startServer = async () => {
    await connectDB();
}
startServer();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Allow cookies and credentials
};
//Allow all the domains -- just for dev
app.use(cors(corsOptions));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/users', authentication, authorizeRoles('admin'), usersRouter);
app.use('/api/events', authentication, eventsRouter);
app.use('/api/registrations', authentication, registrationRouter);
app.use('/api/uploads', authentication, uploadRouter);
app.use('/api/notifications', authentication, notificationRouter);
app.use('/api/location',authentication, authorizeRoles("producer", "admin"), locationRouter);

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


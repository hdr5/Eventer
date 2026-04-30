# 🚀 Eventer – Event Management Platform

> A production-inspired full-stack application demonstrating real-world event management workflows.

**Eventer** is a full-stack event management system that enables users to discover, register, and manage events, while providing organizers with full control over event creation, participants, and analytics.

The system is designed as a real-world production-like application, with a strong focus on scalability, modularity, and clean architecture principles.

---

## 📸 Screenshots

### 🏠 Home Page
<img width="1885" height="977" alt="home" src="https://github.com/user-attachments/assets/39f31e5a-ca32-49f4-85c0-4fec6b882b6f" />

### 📅 Events Page
<img width="1887" height="973" alt="events" src="https://github.com/user-attachments/assets/41b42543-286d-44c4-bbcb-0b4e5cbf832b" />

### 📍 Event Details – Map Integration
<img width="1880" height="983" alt="event-details" src="https://github.com/user-attachments/assets/a5432ba5-9a38-464c-8cfe-1f3016abe4e9" />

### 🔔 Notifications Center
<img width="1892" height="986" alt="notifications" src="https://github.com/user-attachments/assets/33634ed5-0fe8-46ba-a9ed-86e1a4973f52" />

---

## ✨ Features

### 👤 User Features
- JWT-based authentication (register / login)
- Browse, search, and filter events
- Register / cancel event participation (real-time updates)
- View participation history
- Add / remove favorites
- Real-time notifications (WebSocket)

### 🎯 Organizer Features
- Create, edit, and delete events
- Manage participants per event
- Control event capacity
- View event statistics

---

## 🧠 Architecture

### Frontend
- Feature-based architecture (auth, events, user, location)
- Redux Toolkit for state management
- Custom hooks for reusable logic
- Centralized API layer (Axios client)
- SCSS modular styling

### Backend
- Node.js + Express (MVC pattern)
- Controllers / Routes / Models separation
- Middleware for authentication & authorization
- Structured error handling

---

## 🔌 API Layer
- Centralized Axios client (`axiosClient`)
- JWT token injection via interceptors
- Global error handling
- Environment-based configuration

---

## 🗄️ Database (MongoDB)
- Mongoose schemas with validation
- Compound index to prevent duplicate registrations
- Optimized queries for performance
- Separation between Events and Registrations models

---

## 🔐 Middleware
- JWT authentication middleware
- Role-based authorization
- Ownership validation
- Global error handler

---

## 🗺️ Maps & Location Features
- Google Maps integration for event locations
- Custom hook: `useGoogleMaps`
- Location picker component
- Address normalization utilities
- Redux-based location state management
- Backend support for structured geo data

---

## 🖼️ Image Upload System
- Multer for file handling
- Cloudinary integration for media storage
- CDN-based fast delivery

---

## 🧱 Tech Stack

Frontend: React, Redux Toolkit, SCSS  
Backend: Node.js, Express  
Database: MongoDB (Mongoose)  
Realtime: WebSocket  
Cloud: Cloudinary  

---

## 🔄 Core Flows

### Registration Flow
1. User clicks "Register"
2. JWT validation
3. Duplicate check in DB
4. Registration stored
5. UI updates instantly

---

### Event Creation Flow
1. Organizer creates event
2. Image uploaded to Cloudinary
3. Location selected via Google Maps
4. Event saved in DB
5. Event appears immediately

---

## 📁 Project Structure 
``` 
server/
   controllers/
   models/
   routes/
   middleware/
   utils/
 ```
```
client/
   src/
      api/
      components/
      features/
      hooks/
      pages/
      redux/
      utils/
      assets/
```
 --- 

---

## 🚀 Engineering Highlights
- Compound MongoDB indexes prevent duplicate registrations
- Centralized Axios API layer with interceptors
- Reduced redundant API calls via Redux state design
- Clean separation of backend layers (MVC)
- Scalable architecture ready for microservices
- Real-time updates via WebSocket
- Google Maps integration for structured locations

---

## 🔮 Future Improvements
- Stripe payments for ticketing
- Geo-based event discovery ("Events near me")
- Advanced filtering system
- Admin dashboard
- PWA mobile support
- Recommendation system

---

## 🎯 Project Goal

To design and develop a modular full-stack event management platform with focus on:

- Real-world system architecture
- Clean separation of concerns
- Scalable backend and frontend design
- Efficient state management
- Real-time user experience

# Quantum Digital Dentistry

A futuristic, high-performance dental clinic website and management system built with modern web technologies. This application combines a premium, animated frontend with a robust, secure backend for patient and appointment management.

**🔴 Live Demo:** [https://quantumdental.vercel.app/](https://quantumdental.vercel.app/)

## 🚀 Features

### Frontend (Patient & Public View)
-   **Futuristic Design**: Glassmorphism, neon glows, and smooth transitions using Tailwind CSS.
-   **Animations**: Advanced scroll and entrance animations powered by Framer Motion.
-   **Responsive Navigation**: Mobile-friendly menu with active scroll highlighting.
-   **Interactive Sections**: Hero, About, Services, Gallery, Testimonials, and Contact.
-   **AI Chatbot**: Intelligent assistant for booking appointments and answering queries.
-   **Smooth Scroll**: Integrated `lenis` for premium scroll experiences.

### Backend (Admin & Management)
-   **Secure Authentication**: Admin login with JWT (JSON Web Tokens) and Google OAuth integration.
-   **Patient Management**:
    -   **Search**: Real-time patient search by name or email.
    -   **Records History**: View previous medical records and prescriptions.
    -   **Update & Add**: Edit existing records (text/files) or create new entries.
    -   **File Uploads**: Secure handling of medical attachments (PDFs, Images) using Multer.
-   **Appointment System**: Booking logic with email notifications (Nodemailer).

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) (v19) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **State/Data**: Axios, React Context API

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
-   **Security**: `bcryptjs` (Hashing), `jsonwebtoken` (Auth), `cors`
-   **Utilities**: `multer` (File Uploads), `nodemailer` (Emails)

## ⚙️ Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   MongoDB Connection URI (Local or Atlas)
-   Cloudinary/AWS S3 (Optional, for production file storage)

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd quantum-dentistry
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**:
    ```bash
    cd server
    npm install
    ```

## 💻 Running Locally

This project uses a **concurrent** setup or can be run individually.

### Quick Start (Both Servers)
We recommend running two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Server runs on port 5000.*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Frontend runs on port 5173 (proxies `/api` requests to port 5000).*

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🌐 Deployment (Vercel)

The app is configured for seamless deployment on Vercel as a full-stack application.

1.  **Vercel Config**: `vercel.json` handles routing of API requests to the serverless backend.
2.  **Environment Variables**: Ensure you set the following in Vercel Project Settings:
    -   `MONGO_URI`
    -   `JWT_SECRET`
    -   `GOOGLE_CLIENT_ID`
    -   `EMAIL_USER` / `EMAIL_PASS`
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`

## 📂 Project Structure

-   `src/` - React Frontend components and logic.
-   `server/` - Express Backend routes, controllers, and models.
-   `server/uploads/` - Local directory for uploaded files.

---

© 2026 Quantum Dentistry. All rights reserved.

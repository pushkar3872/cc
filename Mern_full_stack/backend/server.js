require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user.route');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production the frontend is served by this same server, so CORS is only
// needed during local development (Vite runs on a different port).
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? false                          // same-origin — no CORS header needed
        : 'http://localhost:5173',       // Vite dev server
    credentials: true,
};
app.use(cors(corsOptions));

// ── General Middleware ─────────────────────────────────────────────────────────
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);

// ── Serve React Frontend (Production) ─────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the Vite build output
    const distPath = path.join(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(distPath));

    // Wildcard route — let React Router handle client-side navigation
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// ── Environment Variables ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1);
}

// ── Connect DB & Start Server ──────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || 'development'}]`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    });
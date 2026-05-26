const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const metricRoutes = require('./routes/metricRoutes');
const { startSimulation } = require('./services/simulator');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', metricRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Auto-Scaler Backend API Running' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`\n🚀 Backend Server running on port ${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}`);
    console.log('----------------------------------------\n');

    // Start CPU load simulation
    startSimulation();
});

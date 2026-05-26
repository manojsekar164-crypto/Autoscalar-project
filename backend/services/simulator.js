const axios = require('axios');

// Simulate CPU load generation
function generateCPULoad() {
    // Generate random CPU load between 20-90%
    return Math.floor(Math.random() * (90 - 20 + 1)) + 20;
}

// Start simulation - generate CPU load every 5 seconds
function startSimulation() {
    console.log('🔄 Starting CPU Load Simulation...\n');

    setInterval(async () => {
        try {
            const cpuLoad = generateCPULoad();

            // Save to database
            await axios.post('http://localhost:4000/api/metrics', { cpuLoad });

            console.log(`📊 Generated CPU Load: ${cpuLoad}%`);
        } catch (error) {
            console.error('Simulation Error:', error.message);
        }
    }, 5000); // Every 5 seconds
}

module.exports = { startSimulation, generateCPULoad };

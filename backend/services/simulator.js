const axios = require('axios');

// Generate random CPU load between 20% and 90%
function generateCPULoad() {
    return Math.floor(Math.random() * (90 - 20 + 1)) + 20;
}

// Start simulation
function startSimulation() {
    console.log("🔄 Starting CPU Load Simulation...\n");

    setInterval(async () => {
        try {
            const cpuLoad = generateCPULoad();

            const response = await axios.post(
                "http://localhost:4000/api/metrics",
                { cpuLoad },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(`📊 Generated CPU Load: ${cpuLoad}%`);
            console.log("✅ Saved Successfully");
            console.log("--------------------------------");

        } catch (error) {

            console.log("\n❌ Simulation Error");
            console.log("--------------------------------");

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Response:", error.response.data);
            }

            console.log("Message:", error.message);

            if (error.code) {
                console.log("Code:", error.code);
            }

            console.log("--------------------------------\n");
        }

    }, 5000);
}

module.exports = {
    startSimulation,
    generateCPULoad
};
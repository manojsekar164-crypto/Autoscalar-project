const Metric = require('../models/Metric');
const axios = require('axios');

// Save CPU metric to database
exports.saveMetric = async (req, res) => {
    try {
        const { cpuLoad } = req.body;

        const metric = new Metric({
            cpuLoad,
            timestamp: new Date()
        });

        await metric.save();
        console.log(`Saved to DB: ${cpuLoad}`);
        res.status(201).json({ success: true, message: 'Metric saved successfully', data: metric });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get last N metrics
exports.getMetrics = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        const metrics = await Metric.find()
            .sort({ timestamp: -1 })
            .limit(limit);

        res.json({ success: true, data: metrics.reverse() });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get ML prediction
exports.getPrediction = async (req, res) => {
    try {
        // Fetch last 5 CPU load values from MongoDB
        const metrics = await Metric.find()
            .sort({ timestamp: -1 })
            .limit(5);

        if (metrics.length < 5) {
            return res.json({
                success: false,
                message: 'Not enough data for prediction (need at least 5 records)'
            });
        }

        // Convert to array of numbers (chronological order)
        const loads = metrics.reverse().map(m => m.cpuLoad);

        // Call Python Flask ML service
        const mlResponse = await axios.post(
            `${process.env.ML_SERVICE_URL}/predict`,
            { loads }
        );

        const predictedLoad = mlResponse.data.predicted_load;

        // Console log showing input and predicted values
        console.log(`📈 Input loads: [${loads.join(', ')}]`);
        console.log(`🔮 Predicted load: ${predictedLoad.toFixed(2)}%`);

        res.json({
            success: true,
            predicted_load: predictedLoad,
            input_loads: loads
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get scaling decision
exports.getScalingDecision = async (req, res) => {
    try {
        // Get current load
        const latestMetric = await Metric.findOne().sort({ timestamp: -1 });

        if (!latestMetric) {
            return res.json({
                success: false,
                message: 'No metrics available'
            });
        }

        const currentLoad = latestMetric.cpuLoad;

        // Fetch last 5 CPU load values for prediction
        const metrics = await Metric.find()
            .sort({ timestamp: -1 })
            .limit(5);

        let predictedLoad = currentLoad;
        let decision = 'No Action';
        let loads = [];

        if (metrics.length >= 5) {
            loads = metrics.reverse().map(m => m.cpuLoad);

            try {
                // Call Python ML service for prediction
                const mlResponse = await axios.post(
                    `${process.env.ML_SERVICE_URL}/predict`,
                    { loads }
                );
                predictedLoad = mlResponse.data.predicted_load;
            } catch (mlError) {
                console.error('ML Service Error:', mlError.message);
            }
        }

        // Scaling Logic based on PREDICTED load
        if (predictedLoad > 70) {
            decision = 'Scaling Up ⬆️';
            scaleUp();
        } else if (predictedLoad < 40) {
            decision = 'Scaling Down ⬇️';
            scaleDown();
        } else {
            decision = 'No Action';
        }

        // Log decision in clean format
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        console.log(`[Time: ${time}]`);
        console.log(`Loads from DB: [${loads.join(', ')}]`);
        console.log(`Predicted Load: ${Math.round(predictedLoad)}`);
        console.log(`Decision: ${decision}`);
        console.log('----------------------------------\n');

        res.json({
            success: true,
            current_load: currentLoad,
            predicted_load: predictedLoad,
            decision
        });
    } } catch (error) {
    console.error("===== SAVE METRIC ERROR =====");
    console.error(error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Stack:", error.stack);

    res.status(500).json({
        success: false,
        error: error.message
    });
};

// Mock AWS Auto-Scaling Functions
// These simulate cloud instance management
function scaleUp() {
    console.log('🚀 Launching new instance...');
    console.log('✅ Instance i-' + Math.random().toString(36).substr(2, 9) + ' launched');
    console.log('💰 Current instance count: ' + Math.floor(Math.random() * 5 + 2));
}

function scaleDown() {
    console.log('🔻 Terminating instance...');
    console.log('✅ Instance i-' + Math.random().toString(36).substr(2, 9) + ' terminated');
    console.log('💰 Current instance count: ' + Math.floor(Math.random() * 3 + 1));
}

// Start/Stop simulation control
let isSimulationRunning = true;

exports.startSimulation = (req, res) => {
    isSimulationRunning = true;
    console.log('▶️  Simulation started');
    res.json({ success: true, message: 'Simulation started' });
};

exports.stopSimulation = (req, res) => {
    isSimulationRunning = false;
    console.log('⏸️  Simulation stopped');
    res.json({ success: true, message: 'Simulation stopped' });
};

exports.getSimulationStatus = () => isSimulationRunning;

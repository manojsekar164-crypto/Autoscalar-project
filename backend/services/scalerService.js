/**
 * Scaler Service
 * Handles auto-scaling decisions based on predicted CPU load
 * 
 * Thresholds:
 * - Scale Up: predicted_load > 70% (prevents overload)
 * - Scale Down: predicted_load < 30% (saves costs)
 * - No Action: 30% <= predicted_load <= 70% (optimal range)
 */

let isSimulationRunning = true;
let instanceCount = 2; // Start with 2 instances

/**
 * Make scaling decision based on predicted load
 * @param {number} predictedLoad - ML predicted CPU load
 * @returns {string} - Scaling decision
 */
function makeScalingDecision(predictedLoad) {
    if (predictedLoad > 70) {
        return 'Scaling Up ⬆️';
    } else if (predictedLoad < 30) {
        return 'Scaling Down ⬇️';
    } else {
        return 'No Action';
    }
}

/**
 * Scale up - Launch new instance
 * Simulates AWS EC2 Auto Scaling Group scale-out
 */
function scaleUp() {
    if (!isSimulationRunning) return;

    instanceCount++;
    const instanceId = 'i-' + Math.random().toString(36).substr(2, 9);

    console.log('🚀 Launching new instance...');
    console.log(`✅ Instance ${instanceId} launched`);
    console.log(`💰 Current instance count: ${instanceCount}`);
}

/**
 * Scale down - Terminate instance
 * Simulates AWS EC2 Auto Scaling Group scale-in
 */
function scaleDown() {
    if (!isSimulationRunning || instanceCount <= 1) return;

    instanceCount--;
    const instanceId = 'i-' + Math.random().toString(36).substr(2, 9);

    console.log('🔻 Terminating instance...');
    console.log(`✅ Instance ${instanceId} terminated`);
    console.log(`💰 Current instance count: ${instanceCount}`);
}

/**
 * Start simulation
 */
function startSimulation() {
    isSimulationRunning = true;
    console.log('▶️  Simulation started');
}

/**
 * Stop simulation
 */
function stopSimulation() {
    isSimulationRunning = false;
    console.log('⏸️  Simulation stopped');
}

/**
 * Get simulation status
 */
function getStatus() {
    return {
        isRunning: isSimulationRunning,
        instanceCount
    };
}

module.exports = {
    makeScalingDecision,
    scaleUp,
    scaleDown,
    startSimulation,
    stopSimulation,
    getStatus
};

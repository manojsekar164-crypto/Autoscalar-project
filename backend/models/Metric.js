const mongoose = require('mongoose');

// Schema for CPU Load Metrics
const metricSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    cpuLoad: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});

// Index for faster queries
metricSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Metric', metricSchema);

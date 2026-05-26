# Complete Setup Guide - AI Auto-Scaler

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Version: 14.x or higher
- Verify: `node --version`

### 2. Install Python
- Download from: https://www.python.org/
- Version: 3.8 or higher
- Verify: `python --version`

### 3. Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Start MongoDB service
- Verify: MongoDB running on `localhost:27017`

---

## Step-by-Step Installation

### Step 1: Clone/Download Project
```bash
cd autoscaler-project
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

Expected packages:
- express
- mongoose
- cors
- axios
- dotenv
- nodemon (dev)

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

Expected packages:
- react
- react-dom
- axios
- recharts

### Step 4: Install ML Service Dependencies
```bash
cd ../ml-service
pip install -r requirements.txt
```

Expected packages:
- Flask
- Flask-CORS
- numpy
- scikit-learn

---

## Running the Application

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Expected output:
```
🚀 Backend Server running on port 4000
✅ MongoDB Connected Successfully
🔄 Starting CPU Load Simulation...
```

**Terminal 2 - Start ML Service:**
```bash
cd ml-service
python app.py
```
Expected output:
```
🤖 ML Service Starting...
📊 Using Linear Regression for prediction
🌐 Running on http://localhost:5000
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm start
```
Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

### Option 2: Docker (Optional)
```bash
docker-compose up --build
```

---

## Accessing the Application

1. Open browser: `http://localhost:3000`
2. Dashboard will load automatically
3. Data refreshes every 5 seconds

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `backend/.env`
- Default: `mongodb://localhost:27017/autoscaler`

### ML Service Connection Error
- Ensure Python Flask is running on port 5000
- Check `backend/.env` ML_SERVICE_URL
- Verify no port conflicts

### CORS Errors
- Backend must be running on port 4000
- Frontend must be running on port 3000
- Check CORS middleware in `backend/server.js`

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

---

## Testing the System

1. Wait 10-15 seconds after starting all services
2. Check backend console for CPU load generation
3. Check ML service console for predictions
4. Verify dashboard shows:
   - Current CPU Load
   - Predicted Load
   - Scaling Decision
   - Live graph

---

## Project Structure Verification

```
autoscaler-project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── metricController.js
│   ├── models/
│   │   └── Metric.js
│   ├── routes/
│   │   └── metricRoutes.js
│   ├── services/
│   │   └── simulator.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   ├── LoadChart.js
│   │   │   ├── MetricCard.js
│   │   │   └── MetricCard.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── ml-service/
│   ├── app.py
│   └── requirements.txt
└── README.md
```

---

## API Endpoints Reference

### Backend (http://localhost:4000/api)

1. **POST /metrics**
   - Save CPU metric
   - Body: `{ "cpuLoad": 65 }`

2. **GET /metrics?limit=20**
   - Get last N metrics
   - Returns: Array of metrics

3. **GET /predict**
   - Get ML prediction
   - Returns: `{ "predicted_load": 72.5 }`

4. **GET /scale**
   - Get scaling decision
   - Returns: Current load, predicted load, decision

### ML Service (http://localhost:5000)

1. **POST /predict**
   - Predict future load
   - Body: `{ "loads": [50, 55, 60, 65, 70] }`
   - Returns: `{ "predicted_load": 75.2 }`

---

## Console Output Examples

### Backend Console:
```
[Time: 14:30:45]
Current Load: 68.00%
Predicted Load: 72.50%
Decision: Scaling Up ⬆️
🚀 Launching new instance...
✅ Instance i-abc123xyz launched
----------------------------------------
```

### ML Service Console:
```
📈 Input loads: [50, 55, 60, 65, 70]
🔮 Predicted load: 72.50%
```

---

## For Project Viva/Demo

### Key Points to Explain:

1. **Architecture**: MERN + Python microservices
2. **ML Model**: Linear Regression for time-series prediction
3. **Scaling Logic**: Threshold-based (>70% up, <40% down)
4. **Real-time**: Auto-refresh every 5 seconds
5. **Simulation**: Mock AWS EC2 auto-scaling

### Demo Flow:
1. Show dashboard loading
2. Explain metric cards
3. Show live graph updating
4. Point out scaling decisions in console
5. Explain ML prediction logic

---

## Next Steps / Enhancements

- Add authentication
- Implement real AWS integration
- Use advanced ML models (LSTM, Prophet)
- Add historical data analysis
- Implement cost optimization
- Add email/SMS alerts
- Multi-region support

---

## Support

For issues:
1. Check all services are running
2. Verify MongoDB connection
3. Check console logs
4. Ensure correct ports (3000, 4000, 5000)

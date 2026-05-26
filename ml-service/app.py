from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Health check endpoint
@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'ML Service Running', 'status': 'active'})

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict future CPU load using Linear Regression
    Input: { "loads": [array of recent CPU values] }
    Output: { "predicted_load": number }
    """
    try:
        data = request.get_json()
        loads = data.get('loads', [])
        
        if len(loads) < 3:
            return jsonify({
                'error': 'Need at least 3 data points for prediction'
            }), 400
        
        # Simple Linear Regression using basic math
        # Calculate trend from recent data points
        n = len(loads)
        x_values = list(range(n))
        
        # Calculate slope (trend)
        x_mean = sum(x_values) / n
        y_mean = sum(loads) / n
        
        numerator = sum((x_values[i] - x_mean) * (loads[i] - y_mean) for i in range(n))
        denominator = sum((x_values[i] - x_mean) ** 2 for i in range(n))
        
        if denominator != 0:
            slope = numerator / denominator
            intercept = y_mean - slope * x_mean
            # Predict next value
            predicted_load = slope * n + intercept
        else:
            # Fallback to moving average
            predicted_load = sum(loads[-3:]) / min(3, len(loads))
        
        # Ensure prediction is within valid range (0-100)
        predicted_load = max(0, min(100, predicted_load))
        
        print(f"📈 Input loads: {loads}")
        print(f"🔮 Predicted load: {predicted_load:.2f}%")
        
        return jsonify({
            'predicted_load': round(predicted_load, 2),
            'method': 'Linear Regression',
            'input_size': len(loads)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('\n🤖 ML Service Starting...')
    print('📊 Using Linear Regression for prediction')
    print('🌐 Running on http://localhost:5000')
    print('----------------------------------------\n')
    app.run(host='0.0.0.0', port=5000, debug=True)

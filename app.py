from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Store the latest sensor data
sensor_data = {
    "heartRate": "N/A",
    "SPO2": "N/A",
    "temperature": "N/A",
    "stepCount": "N/A"
}

@app.route('/data', methods=['POST'])
def receive_data():
    # Retrieve data sent from the ESP8266/ESP32
    sensor_data['heartRate'] = request.form.get('heartRate', 'N/A')
    sensor_data['SPO2'] = request.form.get('SPO2', 'N/A')
    
    # Get temperature, add 3 if it's a valid number
    temperature = request.form.get('temperature', 'N/A')
    if temperature != 'N/A':
        try:
            # Convert to float, add 3, then store
            sensor_data['temperature'] = float(temperature) 
        except ValueError:
            sensor_data['temperature'] = 'N/A'  # Set to 'N/A' if conversion fails
    
    sensor_data['stepCount'] = request.form.get('stepCount', 'N/A')
    return jsonify({"status": "success", "message": "Data received successfully"})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/latest-data')
def latest_data():
    return jsonify(sensor_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

import pandas as pd
import numpy as np
import math
import json
import sys

# Constants
RECKLESS_TURN_THRESHOLD = 5  # degrees for direction change
RAPID_ACCEL_THRESHOLD = 2.0  # m/s^2
RAPID_DECEL_THRESHOLD = -2.0  # m/s^2
TIME_INTERVAL = 20  # seconds
GRAVITY = 9.8  # Earth's gravity in m/s^2

# Function to calculate roll from accelerometer data
def calculate_roll(ax, ay, az):
    return math.degrees(math.atan2(ay, az))

# Function to calculate distance using numerical integration
def calculate_distance(sensor_data):
    # Convert g to m/s^2
    sensor_data = sensor_data / GRAVITY
    # Calculate velocity and distance
    velocity = sensor_data * TIME_INTERVAL
    distance = velocity.cumsum() * TIME_INTERVAL
    total_distance = np.sqrt((distance ** 2).sum(axis=1)).iloc[-1]
    return total_distance

# Read input data from command line argument
input_data = sys.argv[1]

# Check if input data is empty or not in expected format
try:
    sensor_data = pd.DataFrame(json.loads(input_data))
except json.JSONDecodeError:
    print(json.dumps({"error": "Invalid sensor data format"}))
    sys.exit(1)

if sensor_data.empty:
    print(json.dumps({"error": "No sensor data provided"}))
    sys.exit(1)

# Convert data to numeric and handle non-numeric data
sensor_data['ax'] = pd.to_numeric(sensor_data['ax'], errors='coerce')
sensor_data['ay'] = pd.to_numeric(sensor_data['ay'], errors='coerce')
sensor_data['az'] = pd.to_numeric(sensor_data['az'], errors='coerce')

# Calculate roll for each row
sensor_data['roll'] = sensor_data.apply(lambda row: calculate_roll(row['ax'], row['ay'], row['az']), axis=1)

# Reckless Driving Count
reckless_driving_count = 0
turn_indices = sensor_data[sensor_data['roll'].abs() > RECKLESS_TURN_THRESHOLD].index
total_distance = 0

for i in range(1, len(turn_indices), 2):
    if i + 1 < len(turn_indices):
        start_idx, end_idx = turn_indices[i - 1], turn_indices[i + 1]
        segment_data = sensor_data.iloc[start_idx:end_idx + 1][['ax', 'ay', 'az']]
        segment_distance = calculate_distance(segment_data)
        total_distance += segment_distance

        start_pos = sensor_data.iloc[start_idx][['ax', 'ay', 'az']]
        end_pos = sensor_data.iloc[end_idx][['ax', 'ay', 'az']]
        straight_line_distance = np.linalg.norm(end_pos - start_pos)

        if segment_distance > 2 * straight_line_distance:
            reckless_driving_count += 1

# Rapid Acceleration and Deceleration Count
rapid_accel_count = 0
rapid_decel_count = 0

for i in range(1, len(sensor_data)):
    # Calculate change in acceleration for each axis
    delta_ax = sensor_data['ax'].iloc[i] - sensor_data['ax'].iloc[i-1]
    delta_ay = sensor_data['ay'].iloc[i] - sensor_data['ay'].iloc[i-1]
    delta_az = sensor_data['az'].iloc[i] - sensor_data['az'].iloc[i-1]
    
    # Calculate the magnitude of acceleration change
    delta_v = np.linalg.norm([delta_ax, delta_ay, delta_az])

    if delta_v > RAPID_ACCEL_THRESHOLD:
        rapid_accel_count += 1
    elif delta_v < RAPID_DECEL_THRESHOLD:
        rapid_decel_count += 1

# Output the results in JSON format
output = {
    "reckless_driving_count": reckless_driving_count,
    "rapid_acceleration_count": rapid_accel_count,
    "rapid_deceleration_count": rapid_decel_count,
    "total_distance": total_distance
}

# Log the output
print(json.dumps(output))

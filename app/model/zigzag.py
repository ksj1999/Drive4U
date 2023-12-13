import pandas as pd
import numpy as np
import math
import json
import sys

# Thresholds for detection
RECKLESS_TURN_THRESHOLD = 20  # degrees
RAPID_ACCEL_THRESHOLD = 2.0  # m/s^2
RAPID_DECEL_THRESHOLD = -2.0  # m/s^2

# Function to calculate roll from accelerometer data
def calculate_roll(ax, ay, az):
    return math.degrees(math.atan2(ay, az))

# Read input data from command line argument
input_data = sys.argv[1]

# Check if input data is empty or not in expected format
try:
    sensor_data = pd.DataFrame(json.loads(input_data))
except json.JSONDecodeError:
    print(json.dumps({"error": "Invalid sensor data format"}))
    sys.exit(1)

# Check if the sensor data is empty
if sensor_data.empty:
    print(json.dumps({"error": "No sensor data provided"}))
    sys.exit(1)

# Calculate roll for each row
sensor_data['roll'] = sensor_data.apply(lambda row: calculate_roll(row['ax'], row['ay'], row['az']), axis=1)

# Reckless Driving Count
reckless_turn_count = sensor_data['roll'].abs() > RECKLESS_TURN_THRESHOLD
reckless_driving_count = sum(reckless_turn_count)

# Rapid Acceleration and Deceleration Count
rapid_accel_count = 0
rapid_decel_count = 0

for i in range(1, len(sensor_data)):
    # Calculate the change in acceleration
    delta_ax = sensor_data['ax'].iloc[i] - sensor_data['ax'].iloc[i-1]
    delta_ay = sensor_data['ay'].iloc[i] - sensor_data['ay'].iloc[i-1]
    delta_az = sensor_data['az'].iloc[i] - sensor_data['az'].iloc[i-1]

    # Check for rapid acceleration/deceleration
    if delta_ax > RAPID_ACCEL_THRESHOLD or delta_ay > RAPID_ACCEL_THRESHOLD or delta_az > RAPID_ACCEL_THRESHOLD:
        rapid_accel_count += 1
    elif delta_ax < RAPID_DECEL_THRESHOLD or delta_ay < RAPID_DECEL_THRESHOLD or delta_az < RAPID_DECEL_THRESHOLD:
        rapid_decel_count += 1

# Output the results in JSON format
output = {
    "reckless_driving_count": reckless_driving_count,
    "rapid_acceleration_count": rapid_accel_count,
    "rapid_deceleration_count": rapid_decel_count
}
print(json.dumps(output))

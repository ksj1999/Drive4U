import sys
from joblib import load
import pandas as pd
import numpy as np
import math

# Corrected indexing for reading arguments from command line
time = sys.argv[1]
ax = float(sys.argv[2])
ay = float(sys.argv[3])
az = float(sys.argv[4])
gx = float(sys.argv[5])
gy = float(sys.argv[6])
gz = float(sys.argv[7])

# Create a DataFrame with sensor data
sensor_data = pd.DataFrame({
    'time' : [time]
    'ax': [abs(ax)],
    'ay': [abs(ay)],
    'az': [abs(az)],
    'gx': [abs(gx)],
    'gy': [abs(gy)],
    'gz': [abs(gz)]
})

def calculate_roll(accel_data):
    ax, ay, az = accel_data
    roll = math.atan2(ay, az)
    roll_degrees = math.degrees(roll)
    return roll_degrees

# 롤 각도 계산 및 방향 전환 감지
sensor_data['roll'] = sensor_data.apply(lambda row: calculate_roll((row['ax'], row['ay'], row['az'])), axis=1)
turn_points = sensor_data['roll'].abs() > 20  # 20도를 초과하는 지점을 방향 전환 지점으로 간주

# 'time' 열을 timedelta로 변환
sensor_data['time'] = pd.to_timedelta(sensor_data['time'], unit='s')

def integrate(data, time):
    integral = np.zeros(len(data))
    for i in range(1, len(data)):
        dt = (time.iloc[i] - time.iloc[i-1]).total_seconds()  # Calculate the time difference in seconds
        integral[i] = integral[i-1] + np.trapz([data.iloc[i-1], data.iloc[i]], [0, dt])
    return integral

# Calculate the velocities
sensor_data['vx'] = integrate(sensor_data['ax'], sensor_data['time'])
sensor_data['vy'] = integrate(sensor_data['ay'], sensor_data['time'])
sensor_data['vz'] = integrate(sensor_data['az'], sensor_data['time'])



# 속도 적분하여 위치(이동 거리) 계산
sensor_data['sx'] = integrate(sensor_data['vx'], sensor_data['time'])
sensor_data['sy'] = integrate(sensor_data['vy'], sensor_data['time'])
sensor_data['sz'] = integrate(sensor_data['vz'], sensor_data['time'])

# 방향 전환 지점에서의 위치 계산
turn_positions = sensor_data[turn_points][['sx', 'sy', 'sz']]

# 최단 거리 (시작점에서 끝점까지의 직선 거리)
# 방향 전환 지점이 있을 경우, 첫 번째와 마지막 지점을 사용합니다.
if not turn_positions.empty:
    start_position = turn_positions.iloc[0]
    end_position = turn_positions.iloc[-1]
    displacement = np.sqrt((end_position - start_position).pow(2).sum())
else:
    # 방향 전환 지점이 없는 경우, 전체 경로의 시작점과 끝점을 사용합니다.
    start_position = sensor_data.iloc[0][['sx', 'sy', 'sz']]
    end_position = sensor_data.iloc[-1][['sx', 'sy', 'sz']]
    displacement = np.sqrt((end_position - start_position).pow(2).sum())

# 실제 이동 거리 (경로를 따라가며 거리 누적)
actual_distance = np.sum(np.sqrt(np.diff(sensor_data['sx'])**2 + np.diff(sensor_data['sy'])**2 + np.diff(sensor_data['sz'])**2))

print("최단 거리:", displacement)
print("실제 이동 거리:", actual_distance)
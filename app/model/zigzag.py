import pandas as pd
import numpy as np
import math


# 시간 설정: 1초 간격으로 총 60초
time = pd.date_range(start="00:00:00", periods=3000, freq="S")

# 심한 사행 운전을 시뮬레이션하기 위한 가속도 데이터 생성
# ax: 전후 방향 가속도 (이 예제에서는 일정하게 유지)
# ay: 좌우 방향 가속도 (심한 사행 운전을 나타내기 위해 빠른 주기의 사인파 형태로 변화)
# az: 수직 방향 가속도 (중력 가속도를 고려하여 일정하게 유지)
ax = np.zeros(len(time))  # 전후 방향 가속도는 0으로 가정
ay = np.sin(np.linspace(0, 1 * np.pi, len(time)))  # 심한 사행 운전을 나타내는 가속도
az = np.full(len(time), 9.81)  # 중력 가속도

# 데이터프레임 생성
sensor_data = pd.DataFrame({
    'time': time,
    'ax': ax,
    'ay': ay,
    'az': az
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
#sensor_data['time'] = pd.to_timedelta(sensor_data['time'], unit='s')

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

if displacement*2 <= actual_distance:
    1
    print(1)
else:
    0
    print(0)

print("최단 거리:", displacement)
print("실제 이동 거리:", actual_distance)

# Drive4U  

<img width="1000" alt="image" src="https://github.com/ella00100/Drive4U/assets/103167624/1a5f8010-75e6-4506-8552-e768a32417b1">
<img width="1000" alt="image" src="https://github.com/ella00100/Drive4U/assets/103167624/dbb23a9b-c351-4d76-987d-f5f608e7de09">

## About the Project  
**Duration:** September 01, 2023 – December 22, 2023  

Drive4U is a **smart driver-care solution** built using IMU sensor data to evaluate risky driving behaviors and provide personalized driving insights.  
The project also includes an **integrated fleet management system** for rental car companies, improving efficiency in vehicle monitoring and customer management.  

The system encourages safe driving by visualizing risky driving habits, lowering vehicle maintenance costs, and enhancing customer service efficiency for rental companies.  

---

## Key Features  

- **Driving Habit Analysis**  
  Real-time collection of driving and environmental data via sensors, with analysis of overall driving patterns.  

- **Risky Driving Detection**  
  Algorithms detect sudden acceleration, sudden braking, and zigzag driving.  

- **MyData Solution**  
  A personalized dashboard that visualizes driving habits and provides tailored feedback to each driver.  

- **Integrated Control System**  
  A central dashboard for rental companies to manage vehicles and customer data effectively.  

- **Safe Driving Reward System**  
  Encourages competition between drivers, offering differentiated rental fees based on safe driving levels.  

---

## Built With  

![Arduino](https://img.shields.io/badge/Arduino-00878F?style=for-the-badge&logo=arduino&logoColor=white)  
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=yellow)  
![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=black)  
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=yellow)  

---

## System Architecture  

<img width="1000" alt="image" src="https://github.com/ella00100/Drive4U/assets/103167624/2d5fbede-5ae5-4370-a357-bff11cc93dde">

1. **Data Collection:** Arduino Nano 33 BLE Sense collects real-time driving and environmental data and sends it to a web server via WiFi.  
2. **Risk Detection:** Algorithms process the incoming data to detect risky driving and save results in a database.  
3. **Driver Score Update:** Results update each driver’s score and safety level, adjusting rental fees accordingly.  
4. **WISE-PaaS Dashboard:** Integrates with MySQL to visualize data for both drivers and rental companies.  

---

## ERD  

<img width="1000" alt="image" src="https://github.com/ella00100/Drive4U/assets/103167624/99e9b9e7-072a-42b5-86c5-9403e65d35ad">

- **Employee Table:** Stores staff login info and manages vehicle registrations.  
- **Car Table:** Contains car details including ID, type, rental price, and condition.  
- **SensorData Table:** Logs accelerometer, gyroscope, decibel, temperature, and humidity data.  
- **Customers Table:** Holds customer profiles, driving scores, and safety levels.  
- **Rentals Table:** Manages rental records (customer ID, car ID, start & return times).  
- **DriveList Table:** Tracks driving distance, risky driving counts, and updates driver safety scores.  

---

## MyData Solution for Drivers  

<img width="1000" alt="image" src="https://github.com/ella00100/Drive4U/assets/103167624/1b7ebb29-58d6-48f8-aec7-2fa19cb44d24">

- Driving habit evaluation (score, percentile, rank).  
- Personalized insights and safety-driving rewards.  
- Comparison of driving scores across car types.  
- Driving score trends over time.  
- Risk-driving ratio analysis.  
- Tier-based rental costs & vehicle availability.  
- Real-time vehicle environment monitoring (temperature, humidity, decibels).  

---

## Integrated Platform for Rental Companies  

<img width="1000" alt="image" src="https://github.com/ella00100/Drive4U/assets/103167624/04a17010-73d5-4494-8456-eaa26c85a47c">

- Comprehensive vehicle info & maintenance status.  
- Analysis of popular models and rental peak times.  
- Driving level ratios & trend monitoring.  
- Customer info management and ranking by safety.  
- Alerts for overspeeding & excessive noise (>90 dB).  
- Management of new and cumulative customers.  

---

## Team Members  

- **Team Leader:** Seong Jun Kwon – AI development & Data Pipeline
- **Team Member:** Seoyoung Yun – Data sensing & server setup  
- **Team Member:** Minseon Kim – Dashboard implementation  
- **Team Member:** Hyunji Park – Documentation  

---

## Acknowledgements  

Developed as part of the **GeorgiaTech Vertically Integrated Projects** in collaboration with **Inha University**.  

📌 **Project Link:** [Drive4U GitHub Repository](https://github.com/AdvantechPeterPet/Drive4U)  

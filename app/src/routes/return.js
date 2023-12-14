import express from 'express';
import { updateSql, selectSql } from '../database/sql';
import { spawn } from 'child_process';

const router = express.Router();

router.get('/', (req, res) => {
    const rentalID = req.session.rentalID;
    res.render('return', { rentalID: rentalID });
});

router.post('/', async (req, res) => {
    try {
        const { rentalID } = req.body;
        
        // Update the end time for the rental
        await updateSql.endRental(rentalID);

        // Fetch the start and end times for the rental
        const rentalInfo = await selectSql.getRentalTimes(rentalID);
        if (!rentalInfo) {
            return res.status(500).json({ message: 'Rental information not found' });
        }

        const rentalStartTime = new Date(rentalInfo.StartTime);
        const rentalEndTime = new Date(rentalInfo.EndTime);
        const rentalTime = Math.floor((rentalEndTime - rentalStartTime) / (1000 * 60));

        // Fetch sensor data
        const sensorData = await selectSql.getSensorData(rentalInfo.StartTime, rentalInfo.EndTime, rentalInfo.CarName);
        if (!sensorData || sensorData.length === 0) {
            return res.json({ message: 'No sensor data available for analysis', rentalID: rentalID });
        }

        const sensorDataString = JSON.stringify(sensorData);

        const pythonProcess = spawn('python', ['model\\zigzag.py', sensorDataString]);
        let pythonOutput = '';
        let pythonError = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error('Error executing Python script. Exit code:', code);
                console.error('Python error output:', pythonError);
                return res.status(500).json({ message: 'Error executing Python script', code: code });
            }
            try {
                const output = JSON.parse(pythonOutput);
                
                // DriveList 테이블 업데이트
                const recklessDriving = output.reckless_driving_count; // 예시 데이터
                const suddenAccel = output.sudden_acceleration_count;  // 예시 데이터
                const rapidDecel = output.rapid_deceleration_count;     // 예시 데이터
                const RentalDistance = output.total_distance;           // 예시 데이터

                await updateSql.updateDriveList({
                    rentalID, 
                    rentalTime, 
                    recklessDriving, 
                    suddenAccel, 
                    rapidDecel,
                    RentalDistance
                });

                // 고객 정보 업데이트 (DriveTime과 DriveScore)
                const customerID = req.session.customerID; // 세션에서 customerID 가져오기
                await updateSql.updateCustomerDriveInfo(customerID);

                res.json({
                    message: 'Rental ended, DriveList and Customer data updated successfully',
                    rentalID: rentalID,
                    rentalTime: rentalTime,
                    RentalDistance: RentalDistance,
                    pythonOutput: output
                });

            } catch (parseError) {
                console.error('Error parsing Python script output:', parseError);
                res.status(500).json({ message: 'Error parsing Python script output', error: parseError.message });
            }
        });

        pythonProcess.stdin.write(sensorDataString);
        pythonProcess.stdin.end();

    } catch (error) {
        console.error('Error in endRental:', error);
        res.status(500).json({ message: 'Error ending rental and processing data', error: error.message });
    }
});

export default router;

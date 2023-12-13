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

        // Calculate rentalTime in minutes
        const rentalStartTime = new Date(rentalInfo.StartTime);
        const rentalEndTime = new Date(rentalInfo.EndTime);
        const rentalTime = Math.floor((rentalEndTime - rentalStartTime) / (1000 * 60));

        // Fetch sensor data for the rental period with SensorID 1 and carName "Car1"
        const sensorData = await selectSql.getSensorData(rentalInfo.StartTime, rentalInfo.EndTime, "Car1", 1);
        if (!sensorData || sensorData.length === 0) {
            return res.json({ message: 'No sensor data available for analysis', rentalID: rentalID });
        }

        // Convert sensor data to a JSON string
        const sensorDataString = JSON.stringify(sensorData);

        // Execute the Python script with the sensor data
        const pythonProcess = spawn('python', ['model\\zigzag.py', sensorDataString]);
        let pythonOutput = '';
        let pythonError = '';  // Added for error output

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {  // Capturing error output
            pythonError += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Error executing Python script. Exit code:', code);
                console.error('Python error output:', pythonError);  // Printing error output
                return res.status(500).json({ message: 'Error executing Python script', code: code });
            }
            try {
                const output = JSON.parse(pythonOutput);
                res.json({
                    message: 'Rental ended and DriveList updated successfully',
                    rentalID: rentalID,
                    rentalTime: rentalTime, // Include rentalTime in the response
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

module.exports = router;

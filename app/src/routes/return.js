import express from 'express';
import { updateSql, selectSql } from '../database/sql';
import { exec } from 'child_process';

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

        // Fetch sensor data between the start and end times
        const sensorData = await selectSql.getSensorData(rentalInfo.startTime, rentalInfo.endTime, rentalInfo.carName);

        // Check if sensor data is empty
        if (!sensorData || sensorData.length === 0) {
            return res.json({ message: 'No sensor data available for analysis', rentalID: rentalID });
        }

        // Convert sensor data to a format suitable for the Python script
        const sensorDataString = JSON.stringify(sensorData);

        // Execute the Python script with the sensor data
        exec(`python model\\zigzag.py "${sensorDataString}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing Python script:', error);
                return res.status(500).json({ message: 'Error executing Python analysis', error: error.message });
            } else {
                console.log('Python script executed successfully');
                try {
                    const pythonOutput = JSON.parse(stdout);
                    res.json({
                        message: 'Rental ended and DriveList updated successfully',
                        rentalID: rentalID,
                        pythonOutput: pythonOutput
                    });
                } catch (parseError) {
                    console.error('Error parsing Python output:', parseError);
                    res.status(500).json({ message: 'Error parsing Python script output', error: parseError.message });
                }
            }
        });
    } catch (error) {
        console.error('Error in endRental:', error);
        res.status(500).json({ message: 'Error ending rental and processing data', error: error.message });
    }
});

module.exports = router;

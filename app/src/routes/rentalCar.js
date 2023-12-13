import express from "express";
import { insertSql} from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.session.Id;
    res.render('rentalCar', { userId: userId });
    console.log(userId);
});

router.post('/startRental', async (req, res) => {
    try {
        console.log('Start Rental Request Received:', req.body);
        const { customerID, carName } = req.body;
        const result = await insertSql.startRental({ CustomerID: customerID, CarName: carName });
        console.log('Rental started:', result);

        // Choose either sending a response or redirecting
        res.send('Rental started successfully');
    } catch (error) {
        console.error('Error starting rental:', error);
        res.status(500).send('Error starting rental: ' + error.message);
    }
});


export default router;

module.exports = router;
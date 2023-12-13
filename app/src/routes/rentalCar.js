import express from "express";
import { insertSql} from "../database/sql";
import { updateSql } from "../database/sql";
import { exec } from "child_process";
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

        // Redirect to the "return" page after a successful rental
        res.redirect('/return');
    } catch (error) {
        console.error('Error starting rental:', error);
        res.status(500).send('Error starting rental: ' + error.message);
    }
});

export default router;

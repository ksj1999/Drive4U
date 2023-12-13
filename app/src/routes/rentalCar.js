import express from "express";
import { insertSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.session.Id;
    res.render('rentalCar', { userId: userId });
    console.log(userId);
});

router.post('/startRental', async (req, res) => {
    try {
        console.log('Start Rental Request Received:', req.body);
        const { CustomerID, CarName } = req.body;
        const result = await insertSql.startRental({ CustomerID: CustomerID, CarName: CarName });
        const rentalID = result.insertId; // 새로 생성된 RentalID를 가져옵니다.
        req.session.rentalID = rentalID; // 세션에 RentalID 저장

        console.log('Rental started with RentalID:', rentalID);
        res.redirect('/return');
    } catch (error) {
        console.error('Error starting rental:', error);
        res.status(500).send('Error starting rental: ' + error.message);
    }
});

export default router;

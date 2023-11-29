import express from "express";
import { insertSql, selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.session.userId;
    res.render('regCar', { userId: userId });
    console.log(userId);
});

router.post('/', async (req, res) => {
    const vars = req.body;

    const data = {
        CarType: vars.carType,
        EmployeeId: req.session.userId,
    };

    try {
        const carId = await insertSql.setCar(data);

        await insertSql.setCarcare({ CarId: carId, EmployeeId: data.EmployeeId });

        res.redirect('/regPet');
    } catch (error) {
        console.error('Error:', error.message);
        res.redirect('/error'); 
    }
});

module.exports = router;
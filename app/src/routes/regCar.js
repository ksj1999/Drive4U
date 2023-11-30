import express from "express";
import { insertSql, selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.session.Id;
    res.render('regCar', { userId: userId });
    console.log(userId);
});

router.post('/', async (req, res) => {
    const vars = req.body;

    const data = {
        CarName: vars.carName,
        CarType: vars.carType,
        CarPrice: vars.carPrice,
        EmployeeID: req.session.Id,
    };
    console.log(data);

    try {
        await insertSql.setCar(data);
        await insertSql.setCarcare(data);

        res.redirect('/regSensor');

    } catch (error) {
        console.error('Error:', error.message);
        res.redirect('/error'); 
    }
});

module.exports = router;
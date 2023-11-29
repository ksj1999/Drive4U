import express from "express";
import { insertSql, selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.session.Id;
    res.render('rentalCar', { userId: userId });
    console.log(userId);
});

module.exports = router;
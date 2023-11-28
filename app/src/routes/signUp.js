import express from "express";
import { insertSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('signUp');
});

router.post('/', (req, res) => {
    const vars = req.body;

    const data = {
        CustomerId: vars.id,
        Password: vars.password,
        Name: vars.name,
        Email: vars.email
    };

    insertSql.setCustomer(data);
    res.redirect('/signIn');
});
module.exports = router;
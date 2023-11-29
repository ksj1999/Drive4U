import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('regSensor');
});

module.exports = router;

import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('regSensor');
});

router.post('/', async (req, res) => {
    const vars = req.body;
        res.redirect('/customerMain');
});

module.exports = router;

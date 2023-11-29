import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.session.Id;
    res.render('adminMain', { userId: userId });
    console.log(userId);
});

module.exports = router;

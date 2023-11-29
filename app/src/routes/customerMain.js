import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.session.Id;
    res.render('customerMain', { userId: userId });
    console.log(userId);
});
module.exports = router;

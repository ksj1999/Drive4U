import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('report');
});

router.post('/', async (req, res) => {
    res.send(`<script>
                    alert('An accident has been reported.');
                    location.href='/customerMain';
                </script>`);
});

module.exports = router;

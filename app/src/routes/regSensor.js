import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('regSensor');
});

router.post('/', async (req, res) => {
    res.send(`<script>
                    alert('A new vehicle has been registered.');
                    location.href='/adminMain';
                </script>`);
});

module.exports = router;

import express from "express";
import { updateSql } from "../database/sql";
import { exec } from "child_process";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('return');
});


// "return" 버튼 클릭 시 호출될 라우트
router.post('/', async (req, res) => {
    try {
        console.log('End Rental Request:', req.body);
        const { rentalID } = req.body;

        // 대여 종료 시간을 업데이트
        await updateSql.endRental(rentalID);

        // DriveList 테이블의 RentalTime 업데이트 (임의의 값 60으로 고정)
        await updateSql.updateDriveListRentalTime(rentalID, 60); // 60 분으로 고정

        console.log('Rental successfully ended and DriveList updated');
        res.send('Rental ended and DriveList updated successfully');

        // 파이썬 스크립트 실행
        exec('model\\zigzag.py', (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing Python script:', error);
            } else {
                console.log('Python script executed successfully');
                console.log('Python script output:', stdout);
            }
        });
    } catch (error) {
        console.error('Error in endRental:', error);
        res.status(500).send('Error ending rental and updating DriveList: ' + error.message);
    }
});
module.exports = router;

import express from "express";
import { selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('signIn');
});

router.post('/', async (req, res) => {
    const vars = req.body;
    const employees = await selectSql.getEmployees();

    employees.forEach((employee) => {
        console.log('Employee ID:', employee.EmployeeId);
        console.log('Employee Password:', employee.Password);
        console.log(' ');

        if (vars.id == employee.EmployeeId && vars.password == employee.Password) {
            console.log('Login success!');
            req.session.user = { id: employee.EmployeeId, role: 'employee', checkLogin: true };
            req.session.Id = employee.EmployeeId;
        }
    });

    if (req.session.user === undefined) {
        console.log('Login failed!');
        res.send(`<script>
                    alert('아이디 혹은 비밀번호를 확인하세요!');
                    location.href='/';
                </script>`);
    } else if (req.session.user.checkLogin) {
        res.redirect('/userMain');
    }
});

module.exports = router;

import mysql from 'mysql2';

require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gging00100!',
    database: 'Drive4U',
});

const promisePool = pool.promise();

//total applyquery
export const ApplyQuery = {
    applyquery: async(Query) => {
        const sql = Query;
        const[result] = await promisePool.query(sql);
        return result;
    },
}

//select query
export const selectSql = {
    getEmployees: async () => {
        const sql = `select * from Employees`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getCustomers: async() => {
        const sql = `select * from Customers`;
        const [result] = await promisePool.query(sql);
        return result;
    },
}

// insert query
export const insertSql = {
    setEmployee:async (data) => {
        const sql = `insert into Employees(EmployeeId, Password, Name, Email, RegDate) values (
            "${data.EmployeeId}",  "${data.Password}",  "${data.Name}", "${data.Email}", now()
        )`
        console.log(data);
        await promisePool.query(sql);
    },
    setCustomer: async(data) => {
        const sql = `insert into Customers(CustomerId, Password, Name, Email, RegDate) values (
            "${data.CustomerId}",  "${data.Password}", 
             "${data.Name}", "${data.Email}", now()
        )`
        console.log(data);
        await promisePool.query(sql);
    },
    setSensor:async (data) => {
        const sql = `insert into sensordata values ( 1,
            now(), ${data.ax}, ${data.ay},${data.az},
            ${data.gx}, ${data.gy}, ${data.gz},
            ${data.decibel}, ${data.temp}, ${data.humi}
        )`
        console.log(data);
        await promisePool.query(sql);
    },
};
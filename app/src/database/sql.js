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
    setEmployee: async (data) => {
        const sql = `
            INSERT INTO Employees(EmployeeId, Password, Name, Email, RegDate)
            VALUES (?, ?, ?, ?, NOW());
        `;
        console.log(data);

        try {
            await promisePool.query(sql, [data.EmployeeId, data.Password, data.Name, data.Email]);
        } catch (error) {
            console.error('Error inserting employee:', error.message);
        }
    },

    setCustomer: async (data) => {
        const sql = `
            INSERT INTO Customers(CustomerId, Password, Name, Email, RegDate)
            VALUES (?, ?, ?, ?, NOW());
        `;
        console.log(data);

        try {
            await promisePool.query(sql, [data.CustomerId, data.Password, data.Name, data.Email]);
        } catch (error) {
            console.error('Error inserting customer:', error.message);
        }
    },

    setCar: async (data) => {
        const sql = `
            INSERT INTO Cars(CarName, CarType, CarPrice, RegDate)
            VALUES ("${data.CarName}","${data.CarType}",${data.CarPrice},NOW());
        `;
    
        try {
            await promisePool.query(sql,);
        } catch (error) {
            console.error('Error inserting car:', error.message);
            throw error; 
        }
    },
    
    setCarcare: async (data) => {
        const sql = `
            INSERT INTO CarCare(CarName, EmployeeID)
            VALUES (?, ?);
        `;
    
        try {
            await promisePool.query(sql, [data.CarName, data.EmployeeID]);
        } catch (error) {
            console.error('Error inserting car care record:', error.message);
            throw error; 
        }
    },

    setSensor:async (data) => {
        const sql = `insert into sensordata values ( 1,
            now(), ${data.ax}, ${data.ay},${data.az},
            ${data.gx}, ${data.gy}, ${data.gz},
            ${data.decibel}, ${data.temp}, ${data.humi}
        )`
        console.log(data);

        try {
          await promisePool.query(sql);
        } catch (error) {
            console.error('Error inserting sensor data:', error.message);
        }
    },
};

import express from 'express';
import logger from 'morgan';
import path from 'path';
import expressSession from "express-session";

import homeRouter from './routes/home';
import sensorRouter from './routes/sensor';

import signUpRouter from './routes/signUp';
import signInAdminRouter from './routes/signIn';
import signInCustomerRouter from './routes/signInCustomer';

import adminMainRouter from './routes/adminMain';
import regCarRouter from './routes/regCar';
import qrRouter from './routes/regSensor';


import customerMainRouter from './routes/customerMain';
import rentalCarRouter from './routes/rentalCar';
import returnRouter from './routes/return';

const expressSanitizer = require("express-sanitizer");

// fs and https 모듈 가져오기
const https = require("https");
const fs = require("fs");

// certificate와 private key 가져오기
// ------------------- STEP 2
const options = {
  key: fs.readFileSync("./src/config/cert.key"),
  cert: fs.readFileSync("./src/config/cert.crt"),
};

const PORT = 8000;
const app = express();

app.use(express.static(path.join(__dirname, '/src')));
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()); 
app.use(
    expressSession({
        secret: "my key",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(expressSanitizer());

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use('/', homeRouter);
app.use('/sensor', sensorRouter);
app.use('/signUp', signUpRouter);
app.use('/signIn', signInAdminRouter);
app.use('/signInCustomer', signInCustomerRouter);

app.use('/customerMain', customerMainRouter);
app.use('/adminMain', adminMainRouter);
app.use('/regCar',regCarRouter);
app.use('/regSensor', qrRouter);
app.use('/rentalCar', rentalCarRouter);
app.use('/return', returnRouter);

// http 서버는 8000번 포트로 실행
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  
  // https 의존성으로 certificate와 private key로 새로운 서버를 시작w
  https.createServer(options, app).listen(5000, () => {
    console.log(`HTTPS server started on port 5000`);
  });
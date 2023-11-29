CREATE TABLE Employees (
    ID INT NOT NULL AUTO_INCREMENT,
    EmployeeId VARCHAR(45) NOT NULL,
    Password VARCHAR(45) NOT NULL,
    Name VARCHAR(45) NOT NULL,
    Email VARCHAR(45) NOT NULL,
    RegDate DATETIME,
    PRIMARY KEY (ID)
);

CREATE TABLE Customers (
    ID INT NOT NULL AUTO_INCREMENT,
    CustomerId VARCHAR(45) NOT NULL,
    Password VARCHAR(45) NOT NULL,
    Name VARCHAR(45) NOT NULL,
    Email VARCHAR(45) NOT NULL,
    RegDate DATETIME,
    DriveScore INT default 0,
    DriveTime int default 0,
    PRIMARY KEY (ID)
);

CREATE TABLE Cars (
    ID INT NOT NULL AUTO_INCREMENT,
    RegDate DATETIME,
    CarType VARCHAR(45) NULL,
    PRIMARY KEY (ID)
);


CREATE TABLE CarCare (
    CarId INT NOT NULL, 
    EmployeeId INT NOT NULL,
    PRIMARY KEY (CarId, EmployeeId),
    FOREIGN KEY (CarId) REFERENCES Cars(ID),
    FOREIGN KEY (EmployeeId) REFERENCES Employees(ID)
);


CREATE TABLE Rentals (
    RentalId INT NOT NULL AUTO_INCREMENT,
    CustomerId INT NOT NULL,
    CarId INT NOT NULL,
    StartTime DATETIME,
    EndTime DATETIME,
    PRIMARY KEY (RentalId),
    FOREIGN KEY (CustomerId) REFERENCES Customers(ID),
    FOREIGN KEY (CarId) REFERENCES Cars(ID)
);

CREATE TABLE CarSensorLinks (
    SensorId INT NOT NULL AUTO_INCREMENT,
    CarId INT NOT NULL,
    PRIMARY KEY (SensorId),
    FOREIGN KEY (CarId) REFERENCES Cars(ID)
);

CREATE TABLE SensorData (
    time DATETIME NOT NULL,
    SensorId INT NOT NULL,
    ax FLOAT NULL,
    ay FLOAT NULL,
    az FLOAT NULL,
    gx FLOAT NULL,
    gy FLOAT NULL,
    gz FLOAT NULL,
    decibel FLOAT NULL,
    temp FLOAT NULL,
    humi FLOAT NULL,
    PRIMARY KEY (time),
    FOREIGN KEY (SensorId) REFERENCES CarSensorLinks(SensorId)
);

CREATE TABLE DriveList(
    ID INT NOT NULL AUTO_INCREMENT,
    CustomerId INT NOT NULL,
    RentalId INT,
    RentalTime DATETIME, 
    RentalDistance FLOAT DEFAULT 0,
    RecklessDriving INT DEFAULT 0,
    SuddenAccel INT DEFAULT 0,
    RapidAccel INT DEFAULT 0,
    PRIMARY KEY (ID),
    FOREIGN KEY (CustomerId) REFERENCES Customers(ID),
    FOREIGN KEY (RentalId) REFERENCES Rentals(RentalId)
);

-- Employees 테이블에 데이터 삽입
INSERT INTO Employees (EmployeeId, Password, Name, Email, RegDate)
VALUES
    ('emp1', 'pd1', 'John Doe', 'john@example.com', NOW()),
    ('emp2', 'pd2', 'Jane Doe', 'jane@example.com', NOW()),
    ('emp3', 'pd3', 'Bob Smith', 'bob@example.com', NOW()),
    ('emp4', 'pd4', 'Alice Johnson', 'alice@example.com', NOW()),
    ('emp5', 'pd5', 'Charlie Brown', 'charlie@example.com', NOW());

-- Customers 테이블에 데이터 삽입
INSERT INTO Customers (CustomerId, Password, Name, Email, RegDate)
VALUES
    ('cust1', 'pd1', 'David Lee', 'david@example.com', NOW()),
    ('cust2', 'pd2', 'Emily Wang', 'emily@example.com', NOW()),
    ('cust3', 'pd3', 'Michael Kim', 'michael@example.com', NOW()),
    ('cust4', 'pd4', 'Sophia Chen', 'sophia@example.com', NOW()),
    ('cust5', 'pd5', 'Daniel Park', 'daniel@example.com', NOW());

-- Cars 테이블에 데이터 삽입
INSERT INTO Cars (CarType, RegDate)
VALUES
    ('Sedan', NOW()),
    ('SUV', NOW()),
    ('Truck', NOW()),
    ('Hatchback', NOW()),
    ('Convertible', NOW());

-- CarCare 테이블에 데이터 삽입
INSERT INTO CarCare (CarId, EmployeeId)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5);

-- Rentals 테이블에 데이터 삽입 (StartTime을 현재 시간에서 4시간 전으로 설정)
INSERT INTO Rentals (CustomerId, CarId, StartTime, EndTime)
VALUES
    (1, 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),
    (2, 2, DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW()),
    (3, 3, DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW()),
    (4, 4, DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW()),
    (5, 5, DATE_SUB(NOW(), INTERVAL 7 HOUR), NOW());

-- CarSensorLinks 테이블에 데이터 삽입
INSERT INTO CarSensorLinks (CarId)
VALUES
    (1),
    (2),
    (3),
    (4),
    (5);

-- SensorData 테이블에 데이터 삽입 (time을 현재 시간에서 5분, 4분, 3분, 2분, 1분 전으로 설정)
INSERT INTO SensorData (time, SensorId, ax, ay, az, gx, gy, gz, decibel, temp, humi)
VALUES
    (DATE_SUB(NOW(), INTERVAL 5 MINUTE), 1, 0.1, 0.2, 0.3, 1.1, 1.2, 1.3, 50.5, 25.5, 60.0),
    (DATE_SUB(NOW(), INTERVAL 4 MINUTE), 1, 0.2, 0.3, 0.4, 1.2, 1.3, 1.4, 55.5, 26.0, 61.0),
    (DATE_SUB(NOW(), INTERVAL 3 MINUTE), 2, 0.3, 0.4, 0.5, 1.3, 1.4, 1.5, 60.5, 26.5, 62.0),
    (DATE_SUB(NOW(), INTERVAL 2 MINUTE), 2, 0.4, 0.5, 0.6, 1.4, 1.5, 1.6, 65.5, 27.0, 63.0),
    (DATE_SUB(NOW(), INTERVAL 1 MINUTE), 3, 0.5, 0.6, 0.7, 1.5, 1.6, 1.7, 70.5, 27.5, 64.0);

-- DriveList 테이블에 데이터 삽입 (RentalTime을 대여의 총 시간으로 설정)
INSERT INTO DriveList (CustomerId, RentalId, RentalTime, RentalDistance, RecklessDriving, SuddenAccel, RapidAccel)
VALUES
    (1, 1, TIMEDIFF((SELECT EndTime FROM Rentals WHERE RentalId = 1), (SELECT StartTime FROM Rentals WHERE RentalId = 1)), 50.0, 1, 0, 1),
    (2, 2, TIMEDIFF((SELECT EndTime FROM Rentals WHERE RentalId = 2), (SELECT StartTime FROM Rentals WHERE RentalId = 2)), 60.0, 0, 1, 1),
    (3, 3, TIMEDIFF((SELECT EndTime FROM Rentals WHERE RentalId = 3), (SELECT StartTime FROM Rentals WHERE RentalId = 3)), 70.0, 1, 1, 0),
    (4, 4, TIMEDIFF((SELECT EndTime FROM Rentals WHERE RentalId = 4), (SELECT StartTime FROM Rentals WHERE RentalId = 4)), 80.0, 0, 1, 1),
    (5, 5, TIMEDIFF((SELECT EndTime FROM Rentals WHERE RentalId = 5), (SELECT StartTime FROM Rentals WHERE RentalId = 5)), 90.0, 1, 0, 1);

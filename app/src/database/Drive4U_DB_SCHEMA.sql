-- Employees 테이블
CREATE TABLE Employees (
    EmployeeID VARCHAR(45) NOT NULL,
    Password VARCHAR(45) NOT NULL,
    Name VARCHAR(45) NOT NULL,
    Email VARCHAR(45) NOT NULL,
    RegDate DATETIME,
    PRIMARY KEY (EmployeeID)
);

-- Customers 테이블
CREATE TABLE Customers (
    CustomerID VARCHAR(45) NOT NULL,
    Password VARCHAR(45) NOT NULL,
    Name VARCHAR(45) NOT NULL,
    Email VARCHAR(45) NOT NULL,
    RegDate DATETIME,
    DriveScore INT DEFAULT 0,
    DriveTime INT DEFAULT 0,
    DriveLevel varchar(45),
    PRIMARY KEY (CustomerID)
);

-- Cars 테이블
CREATE TABLE Cars (
    CarID INT NOT NULL AUTO_INCREMENT,
    CarName VARCHAR(45) NOT NULL,
    RegDate DATETIME,
    CarType VARCHAR(45) NULL,
    CarPrice INT NULL,
    CarState VARCHAR(20) DEFAULT 'Available',
    PRIMARY KEY (CarID),
    UNIQUE KEY (CarName)
);

-- CarCare 테이블
CREATE TABLE CarCare (
    CarCareID INT NOT NULL AUTO_INCREMENT,
    CarName VARCHAR(45) NOT NULL,
    EmployeeID VARCHAR(45) NOT NULL,
    PRIMARY KEY (CarCareID),
    FOREIGN KEY (CarName) REFERENCES Cars(CarName),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);

-- Rentals 테이블
CREATE TABLE Rentals (
    RentalID INT NOT NULL AUTO_INCREMENT,
    CustomerID VARCHAR(45) NOT NULL,
    CarName VARCHAR(45) NOT NULL,
    StartTime DATETIME,
    EndTime DATETIME,
    PRIMARY KEY (RentalID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (CarName) REFERENCES Cars(CarName)
);

-- CarSensorLinks 테이블
CREATE TABLE CarSensorLinks (
    CarName VARCHAR(45) NOT NULL,
    SensorID INT NOT NULL,
    FOREIGN KEY (CarName) REFERENCES Cars(CarName)
);

-- SensorData 테이블
CREATE TABLE SensorData (
    time DATETIME NOT NULL,
    SensorID INT NOT NULL,
    ax FLOAT NULL,
    ay FLOAT NULL,
    az FLOAT NULL,
    gx FLOAT NULL,
    gy FLOAT NULL,
    gz FLOAT NULL,
    decibel FLOAT NULL,
    temp FLOAT NULL,
    humi FLOAT NULL,
    PRIMARY KEY (time, SensorID),
    FOREIGN KEY (SensorID) REFERENCES CarSensorLinks(SensorID)
);

-- DriveList 테이블
CREATE TABLE DriveList (
    DriveID INT NOT NULL AUTO_INCREMENT,
    CustomerID VARCHAR(45) NOT NULL,
    RentalID INT NOT NULL,
    RentalTime INT DEFAULT 0,
    RentalDistance FLOAT DEFAULT 0,
    RecklessDriving INT DEFAULT 0,
    SuddenAccel INT DEFAULT 0,
    RapidAccel INT DEFAULT 0,
    PRIMARY KEY (DriveID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (RentalID) REFERENCES Rentals(RentalID)
);

-- Employees 테이블에 데이터 삽입
INSERT INTO Employees (EmployeeID, Password, Name, Email, RegDate)
VALUES
    ('emp1', 'pd1', 'John Doe', 'john@example.com', NOW()),
    ('emp2', 'pd2', 'Jane Doe', 'jane@example.com', NOW()),
    ('emp3', 'pd3', 'Bob Smith', 'bob@example.com', NOW()),
    ('emp4', 'pd4', 'Alice Johnson', 'alice@example.com', NOW()),
    ('emp5', 'pd5', 'Charlie Brown', 'charlie@example.com', NOW());

-- Customers 테이블에 데이터 삽입
INSERT INTO Customers (CustomerID, Password, Name, Email, RegDate, DriveScore, DriveTime, DriveLevel)
VALUES
    ('cust1', 'pd1', 'David Lee', 'david@example.com', NOW(), 0, 0, 'Yellow'),
    ('cust2', 'pd2', 'Emily Wang', 'emily@example.com', NOW(), 0, 0, 'Green'),
    ('cust3', 'pd3', 'Michael Kim', 'michael@example.com', NOW(), 0, 0, 'Green'),
    ('cust4', 'pd4', 'Sophia Chen', 'sophia@example.com', NOW(), 0, 0, 'Red'),
    ('cust5', 'pd5', 'Daniel Park', 'daniel@example.com', NOW(), 0, 0, 'Yellow');

-- Cars 테이블에 데이터 삽입
INSERT INTO Cars (CarName, RegDate, CarType, CarPrice, CarState)
VALUES
    ('Car1', NOW(), 'Sedan', 100, 'Renting'),
    ('Car2', NOW(), 'SUV', 800, 'Available'),
    ('Car3', NOW(), 'Truck', 900, 'Under Repair'),
    ('Car4', NOW(), 'Hatchback', 700, 'Renting'),
    ('Car5', NOW(), 'Convertible', 500, 'Available'),
    ('Car6', NOW(), 'Sedan', 100, 'Renting'),
    ('Car7', NOW(), 'Sedan', 100, 'Available'),
    ('Car8', NOW(), 'Sedan', 100, 'Under Repair');

-- CarCare 테이블에 데이터 삽입
INSERT INTO CarCare (CarName, EmployeeID)
VALUES
    ('Car1', 'emp1'),
    ('Car2', 'emp2'),
    ('Car3', 'emp3'),
    ('Car4', 'emp4'),
    ('Car5', 'emp1'),
    ('Car6', 'emp1'),
    ('Car7', 'emp1'),
    ('Car8', 'emp2');

-- Rentals 테이블에 데이터 삽입 (StartTime을 현재 시간에서 4시간 전으로 설정)
INSERT INTO Rentals (CustomerID, CarName, StartTime, EndTime)
VALUES
    ('cust1', 'Car1', DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),
    ('cust2', 'Car2', DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW()),
    ('cust3', 'Car3', DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW()),
    ('cust4', 'Car4', DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW()),
    ('cust5', 'Car5', DATE_SUB(NOW(), INTERVAL 7 HOUR), NOW());

-- CarSensorLinks 테이블에 데이터 삽입
INSERT INTO CarSensorLinks (CarName,SensorID)
VALUES
    (1, 'Car1'),
    (1, 'Car2'),
    (1, 'Car3'),
    (1, 'Car4'),
    (1, 'Car5'),
    (1, 'Car6'),
    (1, 'Car7'),
    (1, 'Car8');

-- SensorData 테이블에 데이터 삽입 (time을 현재 시간에서 5분, 4분, 3분, 2분, 1분 전으로 설정)
INSERT INTO SensorData (time, SensorID, ax, ay, az, gx, gy, gz, decibel, temp, humi)
VALUES
    (DATE_SUB(NOW(), INTERVAL 5 MINUTE), 1, 0.1, 0.2, 0.3, 1.1, 1.2, 1.3, 50.5, 25.5, 60.0),
    (DATE_SUB(NOW(), INTERVAL 4 MINUTE), 1, 0.2, 0.3, 0.4, 1.2, 1.3, 1.4, 55.5, 26.0, 61.0),
    (DATE_SUB(NOW(), INTERVAL 3 MINUTE), 2, 0.3, 0.4, 0.5, 1.3, 1.4, 1.5, 60.5, 26.5, 62.0),
    (DATE_SUB(NOW(), INTERVAL 2 MINUTE), 2, 0.4, 0.5, 0.6, 1.4, 1.5, 1.6, 65.5, 27.0, 63.0),
    (DATE_SUB(NOW(), INTERVAL 1 MINUTE), 3, 0.5, 0.6, 0.7, 1.5, 1.6, 1.7, 70.5, 27.5, 64.0);

-- DriveList 테이블에 데이터 삽입 (RentalTime을 대여의 총 시간으로 설정)
INSERT INTO DriveList (CustomerID, RentalID, RentalTime, RentalDistance, RecklessDriving, SuddenAccel, RapidAccel)
VALUES
    ('cust1', 1, TIMESTAMPDIFF(MINUTE, (SELECT StartTime FROM Rentals WHERE RentalID = 1), (SELECT EndTime FROM Rentals WHERE RentalID = 1)), 50.0, 1, 0, 1),
    ('cust2', 2, TIMESTAMPDIFF(MINUTE, (SELECT StartTime FROM Rentals WHERE RentalID = 2), (SELECT EndTime FROM Rentals WHERE RentalID = 2)), 60.0, 0, 1, 1),
    ('cust3', 3, TIMESTAMPDIFF(MINUTE, (SELECT StartTime FROM Rentals WHERE RentalID = 3), (SELECT EndTime FROM Rentals WHERE RentalID = 3)), 70.0, 1, 1, 0),
    ('cust4', 4, TIMESTAMPDIFF(MINUTE, (SELECT StartTime FROM Rentals WHERE RentalID = 4), (SELECT EndTime FROM Rentals WHERE RentalID = 4)), 80.0, 0, 1, 1),
    ('cust5', 5, TIMESTAMPDIFF(MINUTE, (SELECT StartTime FROM Rentals WHERE RentalID = 5), (SELECT EndTime FROM Rentals WHERE RentalID = 5)), 90.0, 1, 0, 1);

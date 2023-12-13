DELIMITER //

CREATE PROCEDURE InsertCustomer()
BEGIN
    DECLARE i INT DEFAULT 6;

    WHILE i <= 100 DO
        INSERT INTO Customers (CustomerID, Password, Name, Email, RegDate, DriveScore, DriveTime, DriveLevel)
        VALUES (
            CONCAT('cust', i),
            CONCAT('pd', i),
            CONCAT('User ', i),
            CONCAT('user', i, '@gmail.com'),
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY,
            FLOOR(RAND() * 100),
            FLOOR(RAND() * 1000),
            CASE 
                WHEN DriveScore <= 60 THEN 'Red'
                WHEN DriveScore >= 81 THEN 'Green'
                ELSE 'Yellow'
            END
        );
        SET i = i + 1;
    END WHILE;
END //

DELIMITER ;

CALL InsertCustomer();

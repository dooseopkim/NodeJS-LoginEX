CREATE  TABLE `USERS` (
  `id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NULL ,
  `email` VARCHAR(100) NULL ,
  `password` VARCHAR(100) NULL ,
  `create_date` DATETIME NULL ,
  `modify_date` DATETIME NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `idx1_username` (`username` ASC) ,
  INDEX `idx2_email` (`email` ASC)
);

CREATE TABLE `SNS_META` (
  `id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `created_date` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `SNS_INFO` (
  `id` VARCHAR(50) NOT NULL,
  `sns_id` varchar(255) NOT NULL,
  `sns_type` varchar(10)  NULL,
  `sns_name` varchar(255)  NULL,
  `sns_connect_date` datetime  NULL,
  KEY `idx01_id` (`id`),
  KEY `idx02_sns_id` (`sns_id`),
  CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `USERS` (`id`),
  CONSTRAINT `sns_type` FOREIGN KEY (`sns_type`) REFERENCES `SNS_META` (`id`)
);

-- DUMMY
INSERT INTO users VALUES('U001','test_1@gmail.com','testname_1','testpassword_1',NOW(),NOW());
INSERT INTO users VALUES('U002','test_2@gmail.com','testname_2','testpassword_2',NOW(),NOW());
INSERT INTO users VALUES('U003','test_3@gmail.com','testname_3','testpassword_3',NOW(),NOW());
INSERT INTO users VALUES('U004','test_4@gmail.com','testname_4','testpassword_4',NOW(),NOW());
INSERT INTO users VALUES('U005','test_5@gmail.com','testname_5','testpassword_5',NOW(),NOW());

INSERT INTO sns_meta VALUES('SM01','GOOGLE_OAUTH',NOW());
INSERT INTO sns_meta VALUES('SM02','GITHUB_OAUTH',NOW());
INSERT INTO sns_meta VALUES('SM03','FACEBOOK_OAUTH',NOW());

-- INSERT INTO sns_info VALUES('U001','PLEASE ENTER YOUR GOOGLE_ID','SM01','PLEASE ENTER TOUR GOOGLE_NAME',NOW());



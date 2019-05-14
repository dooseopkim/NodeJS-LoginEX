CREATE  TABLE `USERS` (
  `id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NULL ,
  `email` VARCHAR(100) NULL ,
  `password` VARCHAR(100) NULL ,
  `create_date` DATETIME NULL ,
  `modify_date` DATETIME NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `idx2_email` (`email` ASC) 
);

CREATE TABLE `SNS_INFO` (
  `id` VARCHAR(50) NOT NULL,
  `sns_id` varchar(255) NOT NULL,
  `sns_type` varchar(10)  NULL,
  `sns_name` varchar(255)  NULL,
  `sns_connect_date` datetime  NULL,
  KEY `idx01_id` (`id`),
  KEY `idx02_sns_id` (`sns_id`),
  CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `USERS` (`id`)
);
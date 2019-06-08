CREATE  TABLE `USERS` (
  `id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NULL ,
  `email` VARCHAR(100) NULL ,
  `password` VARCHAR(100) NULL ,
  `create_date` DATETIME DEFAULT NOW(),
  `modify_date` DATETIME DEFAULT NOW(),
  `sns_link` TINYINT(2) DEFAULT 0,
  PRIMARY KEY (`id`) ,
  INDEX `idx1_username` (`username` ASC) ,
  INDEX `idx2_email` (`email` ASC)
);

CREATE TABLE `SNS_META` (
  `id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `created_date` DATETIME DEFAULT NOW(),
  `docs` VARCHAR(100) NULL,
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

CREATE TABLE `BOARD_CATEGORY`(
	`id` VARCHAR(20) NOT NULL,
  `description` VARCHAR(100) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `BOARD` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `contents` TEXT  NULL,
  `category_id` VARCHAR(20)  NULL,
  `user_id` VARCHAR(50) NULL,
  `del_flag` TINYINT(1) DEFAULT 0,
  `view_count` INT DEFAULT 0,
  `create_date` DATETIME DEFAULT NOW(),
  `modify_date` DATETIME DEFAULT NOW(),
  PRIMARY KEY (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `BOARD_CATEGORY` (`id`)
);

CREATE TABLE `FILE_INFO` (
	`id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255),
  `save_file_name` VARCHAR(255),
  `content_type` VARCHAR(50),
  `size` INT,
  `req_count` INT DEFAULT 0,
  `delete_flag` TINYINT(1) DEFAULT 0,
  `create_date` DATETIME DEFAULT NOW(),
  `delete_date` DATETIME,
  PRIMARY KEY (`id`)
);
    
CREATE TABLE `BOARD_IMAGE` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `board_id` INT NOT NULL,
    `file_id` INT NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `board_id` FOREIGN KEY (`board_id`) REFERENCES `BOARD` (`id`),
    CONSTRAINT `file_id` FOREIGN KEY (`file_id`) REFERENCES `FILE_INFO` (`id`)
);

CREATE TABLE `COMMENT` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `board_id` INT,
  `contents` TEXT NULL,
  `user_id` VARCHAR(50),
  `create_date` DATETIME DEFAULT NOW(),
  `modify_date` DATETIME DEFAULT NOW(),
  `del_flag` TINYINT(1) DEFAULT 0,
  `like`INT DEFAULT 0,
  `unlike` INT DEFAULT 0,
  `group_id` INT NULL,
  `group_order` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `board_id_comment` FOREIGN KEY (`board_id`) REFERENCES `board` (`id`),
  CONSTRAINT `user_id_comment` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
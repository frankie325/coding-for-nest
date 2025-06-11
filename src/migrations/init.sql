-- Adminer 5.1.0 MySQL 9.2.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `method` varchar(255) NOT NULL,
  `data` varchar(255) NOT NULL,
  `result` int NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_70c2c3d40d9f661ac502de51349` (`user_id`),
  CONSTRAINT `FK_70c2c3d40d9f661ac502de51349` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `logs` (`id`, `path`, `method`, `data`, `result`, `user_id`) VALUES
(1,	'/var',	'getUser',	'testdata',	200,	1),
(2,	'/usr',	'getLog',	'testdata2',	404,	1),
(3,	'/var',	'post',	'{username:\"kfg\"}',	200,	1),
(4,	'/api/user',	'get',	'{username:\"kfg\"， password:\"123456\"}',	300,	1),
(5,	'/api/logs',	'post',	'test',	500,	1),
(6,	'/api/profile',	'get',	'data1',	201,	1),
(7,	'/api/roles',	'post',	'data2',	404,	1);

DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `acl` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `menus` (`id`, `name`, `order`, `acl`, `path`) VALUES
(1,	'日志管理',	0,	'create,delete,read',	'/logs');

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1,	1749404546869,	'Migration1749404546869'),
(2,	1749460866135,	'Migration1749460866135');

DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gender` int NOT NULL,
  `photo` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `profile` (`id`, `gender`, `photo`, `address`) VALUES
(1,	1,	'www.xxx.png',	'长沙市'),
(2,	0,	'www.lcw.png',	'益阳市'),
(3,	1,	'tom.png',	'纽约');

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` (`id`, `name`) VALUES
(1,	'admin'),
(2,	'test');

DROP TABLE IF EXISTS `roles_menus`;
CREATE TABLE `roles_menus` (
  `menusId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`menusId`,`rolesId`),
  KEY `IDX_e66c7ce4d2940d236ddacba488` (`menusId`),
  KEY `IDX_b465775f8f104ad3673b8d1f41` (`rolesId`),
  CONSTRAINT `FK_b465775f8f104ad3673b8d1f410` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_e66c7ce4d2940d236ddacba4889` FOREIGN KEY (`menusId`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles_menus` (`menusId`, `rolesId`) VALUES
(1,	1);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profileId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`),
  UNIQUE KEY `REL_9466682df91534dd95e4dbaa61` (`profileId`),
  CONSTRAINT `FK_9466682df91534dd95e4dbaa616` FOREIGN KEY (`profileId`) REFERENCES `profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`id`, `username`, `password`, `profileId`) VALUES
(1,	'admin',	'$argon2id$v=19$m=65536,t=3,p=4$IDCaFqh3bmcDJdS/DG1eqQ$HH/QG818f8LeSeTzys7FAE5AeZuZMmse3VOE21pIJKw',	NULL),
(2,	'test',	'$argon2id$v=19$m=65536,t=3,p=4$cAFonjRJNHJTMXLM2+pb5Q$q0xlOR/vEExV/otaC6NRuu8fwi5Bq/30vwCRVc5cDkM',	NULL),
(3,	'kfg',	'$argon2id$v=19$m=65536,t=3,p=4$NRhwX+7LvuItCqEQ6PMf9A$jJcIntBlJDVgqyR4h1d+kbvT23oNQo5Ikk5KjczBNvk',	NULL),
(4,	'lcw',	'$argon2id$v=19$m=65536,t=3,p=4$d51XZDh1qCNK94889eTV7g$HBpRyzMgPFaHTD7xVaJDiJmqJObadnLKPXx3EsrKgQs',	NULL);

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `userId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`userId`,`rolesId`),
  KEY `IDX_472b25323af01488f1f66a06b6` (`userId`),
  KEY `IDX_13380e7efec83468d73fc37938` (`rolesId`),
  CONSTRAINT `FK_13380e7efec83468d73fc37938e` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_472b25323af01488f1f66a06b67` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user_roles` (`userId`, `rolesId`) VALUES
(1,	1);

-- 2025-06-11 02:51:59 UTC
-- telemedicinedb_clean.sql

SET autocommit = 1;
SET SESSION sql_log_bin = 0;
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `telemedicinedb`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `telemedicinedb`;

-- ==================================
-- users
-- ==================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `role` enum('patient','doctor') NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `userpic` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `failed_login_attempts` int NOT NULL DEFAULT '0',
  `locked_until` datetime DEFAULT NULL,
  `lock_count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_users_email` (`email`),
  UNIQUE KEY `uniq_users_phone` (`phone`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES
('D17561960040161325692222880209989220','doctor','Dr. Somchai Sukkasem','s.sukkasem@example.com','0812345678',NULL,'scrypt$1$69ecbfdd994c03689a27a76c78c778a1$fd4a0cce083d1ecd2123ff6a6e80ae545b6425b38315c21c769a2411b317a811712363331d3f07c8aaeede822c134593450be58eba9718c6aa267d266daccf53','2025-08-26 15:13:24','2025-08-27 17:09:11',0,NULL,0),
('D17561971256994886880735565135283805','doctor','Dr. Preecha Chaimongkol','p.chaimongkol@example.com','0823456789',NULL,'scrypt$1$4656562b2a003761037baa5b98763981$61fd2d76ba07fe265134e77de29853ff307b2ea6084a26c32f35875dcf375dda4706cd7e993933d966844ec7ba801b5c63ea790d2be1a0352ced6ccadd6b0fc0','2025-08-26 15:32:05','2025-08-27 17:09:11',0,NULL,0),
('D17561971316859853937022448739154942','doctor','Dr. Suda Thongdee','s.thongdee@example.com','0834567890',NULL,'scrypt$1$1b1ddd2c9080f1db9cc9def768c5305d$aeb2ced0ff551749de7c8d9d8344f8c6eb13cc90b17d672272b8337b34633385f265d7c0082522aa19dbc1cf609302b52254ce34ceb405d90149606397dc6a05','2025-08-26 15:32:11','2025-08-27 17:09:11',0,NULL,0),
('D17562177000210206684481303626439810','doctor','Doctor Methaporn','pedza507@gmail.com','0642727318','/uploads/1756295062703_94d9c0591ed566f59283ec36c45735df.png','scrypt$1$d3fbd3e2b1d2e5bdd842855425c56538$d1fb4148221407ae63b286e1bbd62a875acbd68dacfed91557c3d9aad873c7caf2fb7aea6845ed7b1964930f69bd5f477a8b2b7fac6e4fb911c89926aad60b30','2025-08-26 21:15:00','2025-08-27 18:44:22',0,NULL,0),
('P17562919306053130826119905999161658','patient','Patiene Methaporn','pedza504@gmail.com','0878987656','/uploads/1756293672170_60885841228011c5b80f7b452bdfcadd.png','scrypt$1$34f35117572665d4ed792060cb22ed78$1923d268dd02766de6cdcc1ea745b0fe581022196047da5fdabf8c0d07e70b3f124403da1843289b2c80d8ca5c9636d60587128e3a605bb4cdd414942254a822','2025-08-27 17:52:10','2025-08-27 18:21:40',0,NULL,0);

-- ==================================
-- specialties
-- ==================================
DROP TABLE IF EXISTS `specialties`;
CREATE TABLE `specialties` (
  `id` char(36) NOT NULL,
  `name` varchar(80) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_specialties_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `specialties` VALUES
('001','ศัลยแพทย์','2025-08-26 20:31:53','2025-08-27 18:28:17'),
('002','จักษุแพทย์','2025-08-26 20:31:53','2025-08-27 18:28:17'),
('003','กุมารแพทย์','2025-08-26 20:31:53','2025-08-27 18:28:17'),
('004','อายุรแพทย์','2025-08-26 20:31:53','2025-08-27 18:28:17'),
('005','โสต ศอ นาสิก','2025-08-26 20:31:53','2025-08-27 18:28:17'),
('006','จิตแพทย์','2025-08-27 17:11:43','2025-08-27 18:28:17');

-- ==================================
-- doctor_slots
-- ==================================
DROP TABLE IF EXISTS `doctor_slots`;
CREATE TABLE `doctor_slots` (
  `id` char(36) NOT NULL,
  `doctor_id` char(36) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('available','booked','closed') NOT NULL DEFAULT 'available',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slot` (`doctor_id`,`start_time`,`end_time`),
  UNIQUE KEY `uq_doctor_slots_day` (`doctor_id`,`start_time`),
  KEY `idx_slots_doctor_time` (`doctor_id`,`start_time`,`end_time`),
  CONSTRAINT `fk_slots_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctor_slots_chk_1` CHECK ((`start_time` < `end_time`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doctor_slots` VALUES
('165c395d-833f-11f0-95c2-00e04c6808eb','D17561960040161325692222880209989220','2025-08-29 00:00:00','2025-08-29 23:59:59','available','2025-08-27 19:12:22','2025-08-27 19:12:22'),
('S17562718985260446903376837441029692','D17562177000210206684481303626439810','2025-08-29 00:00:00','2025-08-29 23:59:59','booked','2025-08-27 12:18:18','2025-08-27 19:21:04');

-- ==================================
-- appointments
-- ==================================
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) NOT NULL,
  `doctor_id` char(36) NOT NULL,
  `slot_id` char(36) NOT NULL,
  `status` enum('pending','confirmed','cancelled','rejected') NOT NULL DEFAULT 'pending',
  `note` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `chosen_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_appt_slot` (`slot_id`),
  UNIQUE KEY `uniq_slot_date` (`slot_id`,`chosen_date`),
  KEY `idx_appt_patient` (`patient_id`,`created_at`),
  KEY `idx_appt_doctor` (`doctor_id`,`created_at`),
  KEY `idx_appointments_slot` (`slot_id`),
  CONSTRAINT `fk_appt_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_appt_patient` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `appointments` VALUES
('A17562972648732417321995426643501793','P17562919306053130826119905999161658','D17562177000210206684481303626439810','S17562718985260446903376837441029692','confirmed',NULL,'2025-08-27 19:21:04','2025-08-27 19:30:42','2025-08-29');

-- ==================================
-- consultations
-- ==================================
DROP TABLE IF EXISTS `consultations`;
CREATE TABLE `consultations` (
  `id` char(36) NOT NULL,
  `appointment_id` char(36) NOT NULL,
  `patient_id` char(36) NOT NULL,
  `doctor_id` char(36) NOT NULL,
  `room_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','in_progress','finished','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_consultations_appointment` (`appointment_id`),
  KEY `fk_consultations_patient` (`patient_id`),
  KEY `fk_consultations_doctor` (`doctor_id`),
  CONSTRAINT `fk_consultations_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_consultations_patient` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_consultations_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==================================
-- prescriptions
-- ==================================
DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions` (
  `id` char(36) NOT NULL,
  `consultation_id` char(36) NOT NULL,
  `patient_id` char(36) NOT NULL,
  `doctor_id` char(36) NOT NULL,
  `details` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_prescriptions_consultation` (`consultation_id`),
  KEY `fk_prescriptions_patient` (`patient_id`),
  KEY `fk_prescriptions_doctor` (`doctor_id`),
  CONSTRAINT `fk_prescriptions_consultation` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prescriptions_patient` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prescriptions_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==================================
-- payments
-- ==================================
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `appointment_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('promptpay','credit_card','mock') NOT NULL,
  `status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_payments_appointment` (`appointment_id`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_transaction` (`transaction_id`),
  CONSTRAINT `fk_payments_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==================================
-- doctor_specialties
-- ==================================
DROP TABLE IF EXISTS `doctor_specialties`;
CREATE TABLE `doctor_specialties` (
  `doctor_id` char(36) NOT NULL,
  `specialty_id` char(36) NOT NULL,
  PRIMARY KEY (`doctor_id`,`specialty_id`),
  KEY `fk_ds_specialty` (`specialty_id`),
  CONSTRAINT `fk_ds_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ds_specialty` FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doctor_specialties` VALUES
('D17562177000210206684481303626439810','001'),
('D17561971256994886880735565135283805','002');

-- ==================================
-- END
-- ==================================
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;
SET SESSION sql_log_bin = 1;
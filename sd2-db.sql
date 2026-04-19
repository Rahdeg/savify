-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 31, 2026 at 06:20 PM
-- Server version: 9.6.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `activity_id` int NOT NULL,
  `activity_type` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activity_message` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`activity_id`, `activity_type`, `activity_message`, `created_at`, `user_id`) VALUES
(1, 'Account Created', 'User Aisha Bello created an account', '2026-03-12 15:33:02', 3),
(2, 'Goal Created', 'Aisha created a tuition savings goal', '2026-03-12 15:33:02', 3),
(3, 'Deposit', 'Daniel made a deposit into business savings', '2026-03-12 15:33:02', 4),
(4, 'Withdrawal Request', 'Maria requested withdrawal from emergency fund', '2026-03-12 15:33:02', 5);

-- --------------------------------------------------------

--
-- Table structure for table `bonus`
--

CREATE TABLE `bonus` (
  `bonus_id` int NOT NULL,
  `bonus_percentage` decimal(5,2) DEFAULT NULL,
  `bonus_amount` decimal(10,2) DEFAULT NULL,
  `eligibility_status` enum('eligible','not_eligible') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `awarded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `goal_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bonus`
--

INSERT INTO `bonus` (`bonus_id`, `bonus_percentage`, `bonus_amount`, `eligibility_status`, `awarded_at`, `goal_id`) VALUES
(1, 5.00, 50.00, 'eligible', '2026-03-12 15:32:28', NULL),
(2, 3.00, 30.00, 'eligible', '2026-03-12 15:32:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `verification_id` int NOT NULL,
  `user_id` int NOT NULL,
  `email` varchar(120) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempts` int NOT NULL DEFAULT '0',
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `verified_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `email_verifications`
--

INSERT INTO `email_verifications` (`verification_id`, `user_id`, `email`, `otp_hash`, `expires_at`, `attempts`, `is_used`, `verified_at`, `created_at`, `updated_at`) VALUES
(1, 7, 'raheem@gmail.com', '$2b$10$gXYTPtXOAHknTN3t2FvhBuE1jRvViQVT.Qbep6LvqSXdmdpr5wUEy', '2026-03-30 15:58:26', 0, 0, NULL, '2026-03-30 15:48:25', '2026-03-30 15:48:25'),
(2, 8, 'rahdegonline@gmail.com', '$2b$10$WvVo/qZkR4dyaGvkwZfggOGkXAM0ndSx0rJAugyzOCiLQ3Mk27MYy', '2026-03-30 16:01:05', 0, 1, NULL, '2026-03-30 15:51:05', '2026-03-30 15:51:58'),
(3, 8, 'rahdegonline@gmail.com', '$2b$10$1TQ/3szvqMSoGwHW12aVnOPkLbAcwZb8qSVxsoaCjzyPNGi9ajSs2', '2026-03-30 16:01:59', 0, 1, NULL, '2026-03-30 15:51:58', '2026-03-30 15:58:25'),
(4, 8, 'rahdegonline@gmail.com', '$2b$10$ONxDWBGvI3h0uSExuM772u6r5dZw88D4X/z7umU29i16nTAmLOaAG', '2026-03-30 16:08:25', 0, 0, NULL, '2026-03-30 15:58:25', '2026-03-30 15:58:25'),
(5, 9, 'walettfantasy@gmail.com', '$2b$10$ERpldUSi89DFz0IfRHVvFeApPOtl.Vj7INvxpvUzdEPX.JGKXYHMi', '2026-03-30 18:21:23', 0, 1, NULL, '2026-03-30 18:11:23', '2026-03-30 18:20:11'),
(6, 9, 'walettfantasy@gmail.com', '$2b$10$sz38x/MntOMPTU1DVdUUtePA9hejQC6a8tsoW/FFrVoY2fpQT2EJa', '2026-03-30 18:30:12', 0, 1, NULL, '2026-03-30 18:20:11', '2026-03-30 18:20:34'),
(7, 9, 'walettfantasy@gmail.com', '$2b$10$wdGF3KwEYLBFlIjNo8Vd4ursy5BL9zMZ8h1ujt3ZUvmCbSd2CNi2W', '2026-03-30 18:30:34', 0, 1, NULL, '2026-03-30 18:20:34', '2026-03-30 18:22:01'),
(8, 9, 'walettfantasy@gmail.com', '$2b$10$8niqEuJUOO4ycC5W3gQQLuggbmQWxKrUcJ3V3kbm2nAsdzkv3zy32', '2026-03-30 18:32:01', 0, 1, NULL, '2026-03-30 18:22:01', '2026-03-30 18:26:02'),
(9, 9, 'walettfantasy@gmail.com', '$2b$10$Hk8PWSR/0HnXmv47KroQseV.rSiAHAYiciujce7K6016fiOH9jMKS', '2026-03-30 18:36:02', 0, 1, '2026-03-30 18:26:22', '2026-03-30 18:26:02', '2026-03-30 18:26:22'),
(10, 10, 'walett001@gmail.com', '$2b$10$E99wSexKX40Gc1jrbh.LD.s46rjYQlUl0Ouodn1zuxQTXnhkW8FnW', '2026-03-31 15:33:24', 0, 1, NULL, '2026-03-31 15:23:24', '2026-03-31 15:24:04'),
(11, 10, 'walett001@gmail.com', '$2b$10$Vrz2aHhAETwZcvjHN8eaheoVhxSax6xKdKbBIKknk/YOkRaYxvbb6', '2026-03-31 15:34:05', 0, 0, NULL, '2026-03-31 15:24:04', '2026-03-31 15:24:04'),
(12, 11, 'midastouchfashionempire125@gmail.com', '$2b$10$VYZ.tO/xQNNn2SO5QfxU.OvPVN1YEJQJ3m2ARZyo9CIogcfyahtMW', '2026-03-31 15:35:42', 0, 1, '2026-03-31 15:26:02', '2026-03-31 15:25:42', '2026-03-31 15:26:02'),
(13, 12, 'angeldon2024@gmail.com', '$2b$10$d4YQeEzQIA9szhJBbaILLOIWQUAWB.JRDVhTu6tXnayH1THIJg11C', '2026-03-31 16:05:01', 0, 1, '2026-03-31 15:55:18', '2026-03-31 15:55:00', '2026-03-31 15:55:18'),
(14, 13, 'walettuk95@gmail.com', '$2b$10$TFDJHAgByFPD3bClpF/PROya99.zbt7Kxj5UInM.uxTA5eH2cboBm', '2026-03-31 16:07:48', 0, 1, '2026-03-31 15:58:00', '2026-03-31 15:57:47', '2026-03-31 15:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `goal_category`
--

CREATE TABLE `goal_category` (
  `category_id` int NOT NULL,
  `category_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goal_category`
--

INSERT INTO `goal_category` (`category_id`, `category_name`, `description`) VALUES
(1, 'Tuition', 'Saving for school tuition'),
(2, 'Rent', 'Saving for accommodation'),
(3, 'Business', 'Saving to start a business'),
(4, 'Emergency', 'Emergency savings fund'),
(5, 'Travel', 'Travel savings goal');

-- --------------------------------------------------------

--
-- Table structure for table `payment_method`
--

CREATE TABLE `payment_method` (
  `payment_method_id` int NOT NULL,
  `method_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `provider_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_method`
--

INSERT INTO `payment_method` (`payment_method_id`, `method_name`, `provider_name`, `status`) VALUES
(1, 'Debit Card', 'Visa', 'active'),
(2, 'Debit Card', 'Mastercard', 'active'),
(3, 'Bank Transfer', 'HSBC', 'active'),
(4, 'Bank Transfer', 'Barclays', 'active'),
(5, 'Mobile Payment', 'Apple Pay', 'active'),
(6, 'Mobile Payment', 'Google Pay', 'active'),
(7, 'Online Payment', 'PayPal', 'active'),
(8, 'Online Payment', 'Stripe', 'active'),
(9, 'Mobile Payment', 'Apple Pay', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `savings_goal`
--

CREATE TABLE `savings_goal` (
  `goal_id` int NOT NULL,
  `goal_title` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `goal_description` text COLLATE utf8mb4_general_ci,
  `target_amount` decimal(10,2) DEFAULT NULL,
  `current_amount` decimal(10,2) DEFAULT '0.00',
  `saving_frequency` enum('daily','weekly','monthly') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `scheduled_withdrawal_date` date DEFAULT NULL,
  `goal_status` enum('active','completed','cancelled','withdrawn') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `savings_goal`
--

INSERT INTO `savings_goal` (`goal_id`, `goal_title`, `goal_description`, `target_amount`, `current_amount`, `saving_frequency`, `start_date`, `end_date`, `scheduled_withdrawal_date`, `goal_status`, `created_at`, `category_id`, `user_id`, `updated_at`) VALUES
(1, 'University Tuition', 'Saving for MSc tuition', 5000.00, 1200.00, 'weekly', '2025-01-01', '2025-12-31', '2025-12-31', 'active', '2026-03-12 15:19:22', 1, 3, '2026-03-12 15:41:52'),
(2, 'Apartment Rent', 'Saving for yearly rent', 3000.00, 800.00, 'monthly', '2025-02-01', '2025-11-01', '2025-11-01', 'active', '2026-03-12 15:19:22', 2, 4, '2026-03-12 15:41:52'),
(3, 'Online Store Startup', 'Capital for small business', 2000.00, 400.00, 'weekly', '2025-03-01', '2025-10-01', '2025-10-01', 'active', '2026-03-12 15:19:22', 3, 4, '2026-03-12 15:41:52'),
(4, 'Emergency Savings', 'Personal emergency fund', 1500.00, 600.00, 'monthly', '2025-04-01', '2025-10-01', '2025-10-01', 'active', '2026-03-12 15:19:22', 4, 5, '2026-03-12 15:41:52');

-- --------------------------------------------------------

--
-- Table structure for table `savings_plan`
--

CREATE TABLE `savings_plan` (
  `plan_id` int NOT NULL,
  `goal_id` int DEFAULT NULL,
  `contribution_amount` decimal(10,2) DEFAULT NULL,
  `frequency` enum('daily','weekly','monthly') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contribution_day` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `next_contribution_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `savings_plan`
--

INSERT INTO `savings_plan` (`plan_id`, `goal_id`, `contribution_amount`, `frequency`, `contribution_day`, `next_contribution_date`, `is_active`) VALUES
(1, 1, 10.00, 'weekly', 'Wednesday', '2025-01-08', 1),
(2, 2, 100.00, 'monthly', '1st', '2025-02-01', 1),
(3, 3, 25.00, 'weekly', 'Friday', '2025-03-07', 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL,
  `transaction_type` enum('deposit','bonus','withdrawal') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_reference` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_status` enum('pending','completed','failed') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `goal_id` int DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `transaction_type`, `amount`, `transaction_reference`, `transaction_status`, `transaction_date`, `goal_id`, `payment_method_id`) VALUES
(1, 'deposit', 100.00, 'TXN1001', 'completed', '2026-03-12 15:22:01', 1, 7),
(2, 'deposit', 200.00, 'TXN1002', 'completed', '2026-03-12 15:22:01', 1, 3),
(3, 'deposit', 150.00, 'TXN1003', 'completed', '2026-03-12 15:22:01', 2, 1),
(4, 'deposit', 120.00, 'TXN1004', 'completed', '2026-03-12 15:22:01', 3, 6),
(5, 'deposit', 180.00, 'TXN1005', 'completed', '2026-03-12 15:22:01', 4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `occupation` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_general_ci DEFAULT 'user',
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `occupation`, `password_hash`, `role`, `is_verified`, `created_at`) VALUES
(1, 'Admin One', 'admin1@yopmail.com', 'System Administrator', 'passW0rd@admin1', 'admin', 1, '2026-03-12 14:49:08'),
(2, 'Admin Two', 'admin2@yopmail.com', 'System Administrator', 'passW0rd@admin2', 'admin', 1, '2026-03-12 14:49:08'),
(3, 'Aisha Bello', 'aisha@yopmail.com', 'Student', 'passW0rd', 'user', 1, '2026-03-12 14:49:08'),
(4, 'Daniel Smith', 'daniel@yopmail.com', 'Customer Service', 'passW0rd_1', 'user', 1, '2026-03-12 14:49:08'),
(5, 'Maria Gonzalez', 'maria@yopmail.com', 'Healthcare Assistant', 'passW0rd@1', 'user', 1, '2026-03-12 14:49:08'),
(6, 'walett95', 'walett95@gmail.com', NULL, '$2b$10$kU9fHBu30VKayLLtKYjFHOQOpJt3wtdtK2qDm8n1hwwh2YNXMIT26', 'user', 1, '2026-03-29 13:13:06'),
(7, 'Raheem Chinedu', 'raheem@gmail.com', NULL, '$2b$10$yVPsoDK.D4DkAPyMU1Hd/e260CetFtImb22c7Jtc3qKwWZ2Mz2Mti', 'user', 0, '2026-03-29 13:23:05'),
(8, 'olawale shola', 'rahdegonline@gmail.com', NULL, '$2b$10$WnSHGtyVBdAaRjb3E1YOJeuXABBZ3thKRtmdC/lnb1oo.aM2mZJOm', 'user', 0, '2026-03-30 15:51:05'),
(9, 'Raul', 'walettfantasy@gmail.com', NULL, '$2b$10$clCUeaEWmIeXAOQA3Fl6JOaSOKTNgkFn96xIZ0qgqQ3T8xrZI6iYy', 'user', 1, '2026-03-30 18:11:23'),
(10, 'Hameedah Ajimukoko', 'walett001@gmail.com', NULL, '$2b$10$RDgHY7HYknMj3Ygljs0y..ncUKNEnabTUZK069M8y95PJ/xiE.WgC', 'user', 0, '2026-03-31 15:23:24'),
(11, 'Hameedah Ajimukoko', 'midastouchfashionempire125@gmail.com', NULL, '$2b$10$qz.IqfJjROayY1L9KF6U4e0aucCpbhlD4U4t8nM8u63DJd2GXt4Zu', 'user', 1, '2026-03-31 15:25:42'),
(12, 'George wendy', 'angeldon2024@gmail.com', NULL, '$2b$10$2aSpa45tDYtJzqcg4i9L2uon94VFdn222IvCPINz1cuemFge0wani', 'user', 1, '2026-03-31 15:55:00'),
(13, 'Somoye Dennis', 'walettuk95@gmail.com', 'Teacher', '$2b$10$bQDSIEd.XulCnbrpiZ6g4.J4vXIVH8ZI/SyCVbrmUzLPVN/Zakdjy', 'user', 1, '2026-03-31 15:57:47');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `account_id` int NOT NULL,
  `user_id` int NOT NULL,
  `account_name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `account_number` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `sort_code` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `account_type` enum('current','savings','isa') COLLATE utf8mb4_general_ci DEFAULT 'current',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal`
--

CREATE TABLE `withdrawal` (
  `withdrawal_id` int NOT NULL,
  `requested_amount` decimal(10,2) DEFAULT NULL,
  `approved_amount` decimal(10,2) DEFAULT NULL,
  `reason_for_withdrawal` text COLLATE utf8mb4_general_ci,
  `eligibility_status` enum('eligible','not_eligible') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `withdrawal_status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` timestamp NULL DEFAULT NULL,
  `goal_id` int DEFAULT NULL,
  `user_account_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawal`
--

INSERT INTO `withdrawal` (`withdrawal_id`, `requested_amount`, `approved_amount`, `reason_for_withdrawal`, `eligibility_status`, `withdrawal_status`, `requested_at`, `processed_at`, `goal_id`) VALUES
(1, 1000.00, 1000.00, 'Tuition payment', 'eligible', 'approved', '2026-03-12 15:23:45', NULL, 1),
(2, 500.00, NULL, 'Emergency medical expense', 'not_eligible', 'rejected', '2026-03-12 15:23:45', NULL, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `bonus`
--
ALTER TABLE `bonus`
  ADD PRIMARY KEY (`bonus_id`),
  ADD KEY `goal_id` (`goal_id`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`verification_id`),
  ADD KEY `idx_ev_user_created` (`user_id`,`created_at`),
  ADD KEY `idx_ev_email` (`email`),
  ADD KEY `idx_ev_active` (`user_id`,`is_used`,`verified_at`);

--
-- Indexes for table `goal_category`
--
ALTER TABLE `goal_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `payment_method`
--
ALTER TABLE `payment_method`
  ADD PRIMARY KEY (`payment_method_id`);

--
-- Indexes for table `savings_goal`
--
ALTER TABLE `savings_goal`
  ADD PRIMARY KEY (`goal_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `savings_plan`
--
ALTER TABLE `savings_plan`
  ADD PRIMARY KEY (`plan_id`),
  ADD KEY `goal_id` (`goal_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `goal_id` (`goal_id`),
  ADD KEY `fk_payment_method` (`payment_method_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD PRIMARY KEY (`withdrawal_id`),
  ADD KEY `goal_id` (`goal_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `activity_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bonus`
--
ALTER TABLE `bonus`
  MODIFY `bonus_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `email_verifications`
--
ALTER TABLE `email_verifications`
  MODIFY `verification_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `goal_category`
--
ALTER TABLE `goal_category`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `payment_method_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `savings_goal`
--
ALTER TABLE `savings_goal`
  MODIFY `goal_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `savings_plan`
--
ALTER TABLE `savings_plan`
  MODIFY `plan_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `account_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `withdrawal`
--
ALTER TABLE `withdrawal`
  MODIFY `withdrawal_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `bonus`
--
ALTER TABLE `bonus`
  ADD CONSTRAINT `bonus_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `savings_goal` (`goal_id`);

--
-- Constraints for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD CONSTRAINT `fk_email_verifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `savings_goal`
--
ALTER TABLE `savings_goal`
  ADD CONSTRAINT `savings_goal_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `goal_category` (`category_id`),
  ADD CONSTRAINT `savings_goal_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `savings_plan`
--
ALTER TABLE `savings_plan`
  ADD CONSTRAINT `savings_plan_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `savings_goal` (`goal_id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`payment_method_id`),
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `savings_goal` (`goal_id`);

--
-- Constraints for table `user_account`
--
ALTER TABLE `user_account`
  ADD CONSTRAINT `user_account_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD CONSTRAINT `withdrawal_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `savings_goal` (`goal_id`),
  ADD CONSTRAINT `withdrawal_ibfk_2` FOREIGN KEY (`user_account_id`) REFERENCES `user_account` (`account_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

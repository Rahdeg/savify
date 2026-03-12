-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 12, 2026 at 05:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Savify_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `activity_id` int(11) NOT NULL,
  `activity_type` varchar(100) DEFAULT NULL,
  `activity_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`activity_id`, `activity_type`, `activity_message`, `created_at`, `user_id`) VALUES
(1, 'Account Created', 'User Aisha Bello created an account', '2026-03-12 15:33:02', NULL),
(2, 'Goal Created', 'Aisha created a tuition savings goal', '2026-03-12 15:33:02', NULL),
(3, 'Deposit', 'Daniel made a deposit into business savings', '2026-03-12 15:33:02', NULL),
(4, 'Withdrawal Request', 'Maria requested withdrawal from emergency fund', '2026-03-12 15:33:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bonus`
--

CREATE TABLE `bonus` (
  `bonus_id` int(11) NOT NULL,
  `bonus_percentage` decimal(5,2) DEFAULT NULL,
  `bonus_amount` decimal(10,2) DEFAULT NULL,
  `eligibility_status` enum('eligible','not_eligible') DEFAULT NULL,
  `awarded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `goal_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bonus`
--

INSERT INTO `bonus` (`bonus_id`, `bonus_percentage`, `bonus_amount`, `eligibility_status`, `awarded_at`, `goal_id`) VALUES
(1, 5.00, 50.00, 'eligible', '2026-03-12 15:32:28', NULL),
(2, 3.00, 30.00, 'eligible', '2026-03-12 15:32:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `goal_category`
--

CREATE TABLE `goal_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
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
  `payment_method_id` int(11) NOT NULL,
  `method_name` varchar(50) NOT NULL,
  `provider_name` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
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
  `goal_id` int(11) NOT NULL,
  `goal_title` varchar(150) DEFAULT NULL,
  `goal_description` text DEFAULT NULL,
  `target_amount` decimal(10,2) DEFAULT NULL,
  `current_amount` decimal(10,2) DEFAULT 0.00,
  `saving_frequency` enum('daily','weekly','monthly') DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `scheduled_withdrawal_date` date DEFAULT NULL,
  `goal_status` enum('active','completed','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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
  `plan_id` int(11) NOT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `contribution_amount` decimal(10,2) DEFAULT NULL,
  `frequency` enum('daily','weekly','monthly') DEFAULT NULL,
  `contribution_day` varchar(20) DEFAULT NULL,
  `next_contribution_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
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
  `transaction_id` int(11) NOT NULL,
  `transaction_type` enum('deposit','bonus','withdrawal') DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `transaction_status` enum('pending','completed','failed') DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `goal_id` int(11) DEFAULT NULL,
  `payment_method_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `transaction_type`, `amount`, `transaction_reference`, `transaction_status`, `transaction_date`, `goal_id`, `payment_method_id`) VALUES
(1, 'deposit', 100.00, 'TXN1001', 'completed', '2026-03-12 15:22:01', 1, NULL),
(2, 'deposit', 200.00, 'TXN1002', 'completed', '2026-03-12 15:22:01', 1, NULL),
(3, 'deposit', 150.00, 'TXN1003', 'completed', '2026-03-12 15:22:01', 2, NULL),
(4, 'deposit', 120.00, 'TXN1004', 'completed', '2026-03-12 15:22:01', 3, NULL),
(5, 'deposit', 180.00, 'TXN1005', 'completed', '2026-03-12 15:22:01', 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `occupation`, `password_hash`, `role`, `is_verified`, `created_at`) VALUES
(1, 'Admin One', 'admin1@yopmail.com', 'System Administrator', 'passW0rd@admin1', 'admin', 1, '2026-03-12 14:49:08'),
(2, 'Admin Two', 'admin2@yopmail.com', 'System Administrator', 'passW0rd@admin2', 'admin', 1, '2026-03-12 14:49:08'),
(3, 'Aisha Bello', 'aisha@yopmail.com', 'Student', 'passW0rd', 'user', 1, '2026-03-12 14:49:08'),
(4, 'Daniel Smith', 'daniel@yopmail.com', 'Customer Service', 'passW0rd_1', 'user', 1, '2026-03-12 14:49:08'),
(5, 'Maria Gonzalez', 'maria@yopmail.com', 'Healthcare Assistant', 'passW0rd@1', 'user', 1, '2026-03-12 14:49:08');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal`
--

CREATE TABLE `withdrawal` (
  `withdrawal_id` int(11) NOT NULL,
  `requested_amount` decimal(10,2) DEFAULT NULL,
  `approved_amount` decimal(10,2) DEFAULT NULL,
  `reason_for_withdrawal` text DEFAULT NULL,
  `eligibility_status` enum('eligible','not_eligible') DEFAULT NULL,
  `withdrawal_status` enum('pending','approved','rejected') DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` timestamp NULL DEFAULT NULL,
  `goal_id` int(11) DEFAULT NULL
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
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bonus`
--
ALTER TABLE `bonus`
  MODIFY `bonus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `goal_category`
--
ALTER TABLE `goal_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `payment_method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `savings_goal`
--
ALTER TABLE `savings_goal`
  MODIFY `goal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `savings_plan`
--
ALTER TABLE `savings_plan`
  MODIFY `plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `withdrawal`
--
ALTER TABLE `withdrawal`
  MODIFY `withdrawal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- Constraints for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD CONSTRAINT `withdrawal_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `savings_goal` (`goal_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

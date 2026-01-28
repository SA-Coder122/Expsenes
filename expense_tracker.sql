
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


-- --------------------------------------------------------


-- Table structure for table `transactions`


CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `transactions`


INSERT INTO `transactions` (`id`, `user_id`, `type`, `description`, `amount`, `category`, `date`, `created_at`, `updated_at`) VALUES
(1, 1, 'income', 'Salary', 2500.00, 'Other', '2024-01-15', '2025-10-10 07:44:34', '2025-10-10 07:44:34'),
(2, 1, 'expense', 'Groceries', 150.75, 'Food', '2024-01-16', '2025-10-10 07:44:34', '2025-10-10 07:44:34'),
(3, 1, 'expense', 'Bus fare', 25.50, 'Transport', '2024-01-17', '2025-10-10 07:44:34', '2025-10-10 07:44:34'),
(4, 1, 'income', 'Freelance work', 500.00, 'Other', '2024-01-18', '2025-10-10 07:44:34', '2025-10-10 07:44:34'),
(5, 2, 'income', 'Salary', 3500.00, 'Other', '2024-01-15', '2025-10-10 07:44:34', '2025-10-10 07:44:34'),
(6, 2, 'expense', 'Restaurant', 85.25, 'Food', '2024-01-16', '2025-10-10 07:44:34', '2025-10-10 07:44:34'),
(7, 2, 'expense', 'Movie tickets', 45.00, 'Entertainment', '2024-01-17', '2025-10-10 07:44:34', '2025-10-10 07:44:34');

-- --------------------------------------------------------


CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `pin` char(4) NOT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `theme` varchar(10) DEFAULT 'light',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `users` (`id`, `username`, `pin`, `currency`, `theme`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'admin', '1234', 'USD', 'light', '2025-10-10 07:44:34', '2025-10-10 07:44:34', NULL),
(2, 'testuser', '5678', 'GHS', 'dark', '2025-10-10 07:44:34', '2025-10-10 07:44:34', NULL);

ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_type` (`type`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;


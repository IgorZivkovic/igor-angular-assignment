CREATE TABLE `auth_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text(160) NOT NULL UNIQUE,
	`password_hash` text(255) NOT NULL,
	`role` text NOT NULL,
	`token_version` integer DEFAULT 0 NOT NULL
);

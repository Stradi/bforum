CREATE TABLE `node` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`parent_id` integer,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `node`(`id`) ON UPDATE no action ON DELETE no action
);

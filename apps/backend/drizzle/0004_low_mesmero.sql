CREATE TABLE `replies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`thread_id` integer,
	`body` text NOT NULL,
	`reply_to_id` integer,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reply_to_id`) REFERENCES `replies`(`id`) ON UPDATE no action ON DELETE no action
);

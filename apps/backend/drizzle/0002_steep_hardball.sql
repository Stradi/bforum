CREATE TABLE `thread` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`node_id` integer,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`node_id`) REFERENCES `node`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `thread_slug_unique` ON `thread` (`slug`);
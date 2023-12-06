ALTER TABLE nodes ADD `created_by` integer NOT NULL;--> statement-breakpoint
ALTER TABLE replies ADD `created_by` integer NOT NULL;--> statement-breakpoint
ALTER TABLE threads ADD `created_by` integer NOT NULL;
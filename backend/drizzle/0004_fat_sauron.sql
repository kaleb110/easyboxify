ALTER TABLE "User" ALTER COLUMN "resetToken" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "name" varchar(20) NOT NULL;
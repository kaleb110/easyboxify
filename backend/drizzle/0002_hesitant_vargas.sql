ALTER TABLE "User" ADD COLUMN "resetToken" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "name";
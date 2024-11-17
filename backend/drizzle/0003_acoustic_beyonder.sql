ALTER TABLE "User" ALTER COLUMN "resetToken" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "resetTokenExpiry" DROP NOT NULL;
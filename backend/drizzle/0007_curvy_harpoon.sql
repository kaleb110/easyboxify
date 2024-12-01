ALTER TABLE "Bookmark" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Bookmark" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Bookmark" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "Bookmark_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "Bookmark" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Bookmark" ALTER COLUMN "folderId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "BookmarkTag" ALTER COLUMN "bookmarkId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "BookmarkTag" ALTER COLUMN "tagId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Folder" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Folder" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Folder" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "Folder_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "Folder" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Tag" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Tag" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Tag" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "Tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "Tag" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "User_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "sortPreference" varchar(10) DEFAULT 'nameAZ';--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "plan" varchar(10) DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "subscriptionId" varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" varchar(25);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lastPaymentStatus" varchar(25);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "canceledAt" timestamp;
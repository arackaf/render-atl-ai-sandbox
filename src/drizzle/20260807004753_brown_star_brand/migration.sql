-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "issue_status" AS ENUM('todo', 'done');--> statement-breakpoint
CREATE TABLE "epics" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"description" text,
	"status" "issue_status" DEFAULT 'todo'::"issue_status" NOT NULL,
	"epic_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_epic_id_fkey" FOREIGN KEY ("epic_id") REFERENCES "epics"("id") ON DELETE RESTRICT;
*/
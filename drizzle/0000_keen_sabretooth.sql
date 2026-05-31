CREATE TABLE "repos" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner" text NOT NULL,
	"stars" integer NOT NULL,
	"forks" integer NOT NULL,
	"language" text,
	"updated_at" timestamp NOT NULL
);

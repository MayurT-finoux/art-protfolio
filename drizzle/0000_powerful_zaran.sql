CREATE TABLE "artwork_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"artwork_id" integer NOT NULL,
	"url" text NOT NULL,
	"label" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"width" integer DEFAULT 4 NOT NULL,
	"height" integer DEFAULT 5 NOT NULL,
	"focus" text DEFAULT 'center' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artworks" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"year" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"materials" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"links" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"preview_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"featured_order" integer,
	"status" text DEFAULT 'draft' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artworks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"key" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artwork_images" ADD CONSTRAINT "artwork_images_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artwork_images_artwork_idx" ON "artwork_images" USING btree ("artwork_id","position");--> statement-breakpoint
CREATE INDEX "artworks_status_created_idx" ON "artworks" USING btree ("status","created_at");
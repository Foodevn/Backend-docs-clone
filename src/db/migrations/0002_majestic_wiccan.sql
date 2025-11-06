CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"is_private" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_permissions" (
	"user_id" integer NOT NULL,
	"document_id" integer NOT NULL,
	"permission" varchar(50) NOT NULL,
	"can_share" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "document_permissions_user_id_document_id_pk" PRIMARY KEY("user_id","document_id")
);
--> statement-breakpoint
ALTER TABLE "document_permissions" ADD CONSTRAINT "document_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_permissions" ADD CONSTRAINT "document_permissions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
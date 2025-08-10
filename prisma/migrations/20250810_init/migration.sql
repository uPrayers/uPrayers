-- Create Prayer table and indexes (PostgreSQL)
CREATE TABLE "Prayer" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "name" TEXT,
  "location" TEXT,
  "religion" TEXT NOT NULL,
  "situation" TEXT NOT NULL,
  "text" TEXT NOT NULL
);

ALTER TABLE "Prayer" ADD CONSTRAINT "Prayer_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "Prayer_text_key" ON "Prayer"("text");
CREATE INDEX "Prayer_createdAt_idx" ON "Prayer"("createdAt");

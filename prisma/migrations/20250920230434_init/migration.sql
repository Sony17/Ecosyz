-- CreateTable
CREATE TABLE "public"."Workspace" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resource" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT,
    "tags" JSONB,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Annotation" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "highlights" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShareLink" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "readOnly" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_token_key" ON "public"."ShareLink"("token");

-- AddForeignKey
ALTER TABLE "public"."Resource" ADD CONSTRAINT "Resource_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Annotation" ADD CONSTRAINT "Annotation_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShareLink" ADD CONSTRAINT "ShareLink_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

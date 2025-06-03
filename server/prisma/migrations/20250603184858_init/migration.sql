-- CreateEnum
CREATE TYPE "Role" AS ENUM ('viewer', 'editor');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presentation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ownerNickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" TEXT NOT NULL,
    "presentationId" TEXT NOT NULL,
    "slideIndex" INTEGER NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "presentationId" TEXT NOT NULL,
    "userNickname" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE INDEX "Presentation_title_idx" ON "Presentation"("title");

-- CreateIndex
CREATE INDEX "Slide_presentationId_idx" ON "Slide"("presentationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_presentationId_userNickname_key" ON "UserRole"("presentationId", "userNickname");

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_ownerNickname_fkey" FOREIGN KEY ("ownerNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Presentation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Presentation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userNickname_fkey" FOREIGN KEY ("userNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

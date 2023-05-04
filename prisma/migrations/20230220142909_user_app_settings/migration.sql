-- CreateTable
CREATE TABLE "UserAppSettings" (
    "id" TEXT NOT NULL,
    "name" "AppSettingName" NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAppSettings_name_key" ON "UserAppSettings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAppSettings_userId_name_key" ON "UserAppSettings"("userId", "name");

-- AddForeignKey
ALTER TABLE "UserAppSettings" ADD CONSTRAINT "UserAppSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "MarketCategory" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "league" "League" NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "MarketCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketCategory_category_key" ON "MarketCategory"("category");

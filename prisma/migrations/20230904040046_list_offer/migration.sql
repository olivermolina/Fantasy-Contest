-- CreateTable
CREATE TABLE "ListOffer" (
    "id" TEXT NOT NULL,
    "league" "League" NOT NULL,
    "jsonData" JSONB,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "rating" DOUBLE PRECISION,
    "reviewsCount" INTEGER,
    "imageUrl" TEXT,
    "productUrl" TEXT NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priceHistory" JSONB,
    "category" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "products_rating_idx" ON "products"("rating");

-- CreateIndex
CREATE INDEX "products_scrapedAt_idx" ON "products"("scrapedAt");

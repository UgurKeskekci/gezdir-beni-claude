-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "badgeTone" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "titleTr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "destinationTr" TEXT NOT NULL,
    "destinationEn" TEXT NOT NULL,
    "countryTr" TEXT NOT NULL,
    "countryEn" TEXT NOT NULL,
    "summaryTr" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "descriptionTr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "badgeTr" TEXT,
    "badgeEn" TEXT,
    "durationDays" INTEGER NOT NULL,
    "durationNights" INTEGER NOT NULL,
    "maxGroupSize" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "priceMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TourImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "blurDataUrl" TEXT,
    "altTr" TEXT NOT NULL,
    "altEn" TEXT NOT NULL,
    "creditAuthor" TEXT,
    "creditLicense" TEXT,
    "creditSource" TEXT,
    CONSTRAINT "TourImage_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourHighlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "textTr" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    CONSTRAINT "TourHighlight_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourIncluded" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "textTr" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    CONSTRAINT "TourIncluded_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourItineraryDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "titleTr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionTr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    CONSTRAINT "TourItineraryDay_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Departure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "departsOn" DATETIME NOT NULL,
    "returnsOn" DATETIME,
    "capacity" INTEGER NOT NULL,
    "seatsBooked" INTEGER NOT NULL DEFAULT 0,
    "priceMinor" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Departure_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "tourId" TEXT NOT NULL,
    "departureId" TEXT NOT NULL,
    "travellers" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "unitPriceMinor" INTEGER NOT NULL,
    "totalMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentMethod" TEXT,
    "cardBrand" TEXT,
    "cardLast4" TEXT,
    "paidAt" DATETIME,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reservation_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_departureId_fkey" FOREIGN KEY ("departureId") REFERENCES "Departure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE INDEX "Tour_isPublished_sortOrder_idx" ON "Tour"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "TourImage_tourId_role_position_idx" ON "TourImage"("tourId", "role", "position");

-- CreateIndex
CREATE INDEX "TourHighlight_tourId_position_idx" ON "TourHighlight"("tourId", "position");

-- CreateIndex
CREATE INDEX "TourIncluded_tourId_position_idx" ON "TourIncluded"("tourId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "TourItineraryDay_tourId_day_key" ON "TourItineraryDay"("tourId", "day");

-- CreateIndex
CREATE INDEX "Departure_status_departsOn_idx" ON "Departure"("status", "departsOn");

-- CreateIndex
CREATE UNIQUE INDEX "Departure_tourId_departsOn_key" ON "Departure"("tourId", "departsOn");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reference_key" ON "Reservation"("reference");

-- CreateIndex
CREATE INDEX "Reservation_email_idx" ON "Reservation"("email");

-- CreateIndex
CREATE INDEX "Reservation_status_createdAt_idx" ON "Reservation"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Reservation_departureId_idx" ON "Reservation"("departureId");

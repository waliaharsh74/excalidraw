-- CreateTable
CREATE TABLE "Shape" (
    "shapeId" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "x" TEXT NOT NULL,
    "y" TEXT NOT NULL,
    "height" TEXT,
    "width" TEXT,
    "radius" TEXT,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("shapeId")
);

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

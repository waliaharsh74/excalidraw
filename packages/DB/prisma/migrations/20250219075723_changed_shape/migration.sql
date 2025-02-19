-- DropForeignKey
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_shapeId_fkey";

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

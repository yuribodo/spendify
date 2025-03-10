import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { DeleteRevenueUseCase } from "../revenues-use-cases/delete-revenue";

export function makeDeleteRevenueUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const deleteRevenueUseCase = new DeleteRevenueUseCase(revenuesRepository);
  return deleteRevenueUseCase;
}
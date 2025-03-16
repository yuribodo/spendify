import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { DeleteRevenueUseCase } from "@/use-cases/revenues/delete-revenue";

export function makeDeleteRevenueUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const deleteRevenueUseCase = new DeleteRevenueUseCase(revenuesRepository);
  return deleteRevenueUseCase;
}
import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { UpdateRevenueUseCase } from "../revenues-use-cases/update-revenue";

export function makeUpdateRevenueUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const updateRevenueUseCase = new UpdateRevenueUseCase(revenuesRepository);
  return updateRevenueUseCase;
}
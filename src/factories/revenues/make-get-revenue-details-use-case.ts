import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { GetRevenueDetailsUseCase } from "@/use-cases/revenues/get-revenue-details";

export function makeGetRevenueDetailsUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const getRevenueDetailsUseCase = new GetRevenueDetailsUseCase(revenuesRepository);
  return getRevenueDetailsUseCase;
}
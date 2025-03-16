import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { CreateRevenueUseCase } from "@/use-cases/revenues/create-revenue";

export function makeCreateRevenueUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const createRevenueUseCase = new CreateRevenueUseCase(revenuesRepository);
  return createRevenueUseCase;
}
import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { FilterRevenuesUseCase } from "@/use-cases/revenues/filter-revenue";

export function makeFilterRevenuesUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const filterRevenuesUseCase = new FilterRevenuesUseCase(revenuesRepository);
  return filterRevenuesUseCase;
}
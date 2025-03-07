import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { FilterRevenuesUseCase } from "../revenues-use-cases/filter-revenue";

export function makeFilterRevenuesUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const filterRevenuesUseCase = new FilterRevenuesUseCase(revenuesRepository);
  return filterRevenuesUseCase;
}
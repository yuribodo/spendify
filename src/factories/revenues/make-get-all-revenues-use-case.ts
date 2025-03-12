import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { GetAllRevenuesUseCase } from "@/use-cases/revenues/get-all-revenues";

export function makeGetAllRevenuesUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const getAllRevenuesUseCase = new GetAllRevenuesUseCase(revenuesRepository);
  return getAllRevenuesUseCase;
}
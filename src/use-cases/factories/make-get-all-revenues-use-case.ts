import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { GetAllRevenuesUseCase } from "../revenues-use-cases/get-all-revenues";

export function makeGetAllRevenuesUseCase() {
  const revenuesRepository = new PrismaRevenuesRepository();
  const getAllRevenuesUseCase = new GetAllRevenuesUseCase(revenuesRepository);
  return getAllRevenuesUseCase;
}
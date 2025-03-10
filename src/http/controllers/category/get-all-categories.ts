import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetAllCategoriesUseCase } from "@/use-cases/factories/make-get-all-categories-use-case";

export async function getAllCategories(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getAllCategoriesUseCase = makeGetAllCategoriesUseCase();

    const { categories } = await getAllCategoriesUseCase.execute();

    return reply.status(200).send({ categories });
  } catch (error) {
    throw error;
  }
}
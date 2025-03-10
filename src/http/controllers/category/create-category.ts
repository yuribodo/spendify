import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateCategoryUseCase } from "@/use-cases/factories/make-create-category-use-case";

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
  const createCategoryBodySchema = z.object({
    title: z.string(),
  });

  const { title } = createCategoryBodySchema.parse(request.body);

  try {
    const createCategoryUseCase = makeCreateCategoryUseCase();

    const { category } = await createCategoryUseCase.execute({
      title,
    });

    return reply.status(201).send({ category });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Category with same title already exists') {
        return reply.status(409).send({ message: error.message });
      }
      if (error.message === 'Category title cannot be empty') {
        return reply.status(400).send({ message: error.message });
      }
    }

    throw error;
  }
}
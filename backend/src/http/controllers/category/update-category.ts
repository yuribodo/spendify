import { makeUpdateCategoryUseCase } from "@/factories/categories/make-update-category-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateCategory(request: FastifyRequest, reply: FastifyReply) {
    const updateCategoryParamsSchema = z.object({
        id: z.coerce.number(),
    });

    const updateCategoryBodySchema = z.object({
        title: z.string(),
    });

    const { id } = updateCategoryParamsSchema.parse(request.params);
    const { title } = updateCategoryBodySchema.parse(request.body);

    try {
        const updateCategoryUseCase = makeUpdateCategoryUseCase();

        const { category } = await updateCategoryUseCase.execute({
            id,
            title,
        });

        return reply.status(200).send({ category });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Category with same title already exists') {
                return reply.status(409).send({ message: error.message });
            }
            if (error.message === 'Category title cannot be empty') {
                return reply.status(400).send({ message: error.message });
            }
            if (error.message === 'Category not found') {
                return reply.status(404).send({ message: error.message });
            }
        }

        throw error;
    }
} 
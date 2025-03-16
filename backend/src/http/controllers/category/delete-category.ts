import { makeDeleteCategoryUseCase } from "@/factories/categories/make-delete-category-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
    const deleteCategoryParamsSchema = z.object({
        id: z.coerce.number(),
    });

    const { id } = deleteCategoryParamsSchema.parse(request.params);

    try {
        const deleteCategoryUseCase = makeDeleteCategoryUseCase();

        await deleteCategoryUseCase.execute({
            id,
        });

        return reply.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Category not found') {
                return reply.status(404).send({ message: error.message });
            }
            if (error.message === 'Cannot delete category that is in use by expenses') {
                return reply.status(409).send({ message: error.message });
            }
            if (error.message === 'Cannot delete category that is in use by revenues') {
                return reply.status(409).send({ message: error.message });
            }
        }

        throw error;
    }
} 
import { DataType, ExportFormat } from "@/use-cases/export/export-financial-data";
import { makeExportFinancialDataUseCase } from "@/use-cases/factories/make-export-financial-data-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function exportFinancialData(request: FastifyRequest, reply: FastifyReply) {
    const exportFinancialDataQuerySchema = z.object({
        format: z.enum(['csv', 'json']).default('csv'),
        dataType: z.enum(['expenses', 'revenues', 'all']).default('all'),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        categoryId: z.coerce.number().optional(),
    });

    const { format, dataType, startDate, endDate, categoryId } = exportFinancialDataQuerySchema.parse(request.query);

    try {
        const exportFinancialDataUseCase = makeExportFinancialDataUseCase();

        const { data, filename, contentType } = await exportFinancialDataUseCase.execute({
            userId: request.user.sub,
            format: format as ExportFormat,
            dataType: dataType as DataType,
            startDate,
            endDate,
            categoryId,
        });

        reply.header('Content-Type', contentType);
        reply.header('Content-Disposition', `attachment; filename="${filename}"`);

        return reply.status(200).send(data);
    } catch (error) {
        throw error;
    }
} 
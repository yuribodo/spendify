import { CategoriesRepository } from "@/repositories/categories-repository";
import { ExpensesRepository } from "@/repositories/expenses-repository";
import { RevenuesRepository } from "@/repositories/revenues-repository";
import { Expense, Revenue } from "@prisma/client";

export type ExportFormat = 'csv' | 'json';
export type DataType = 'expenses' | 'revenues' | 'all';

interface ExportFinancialDataUseCaseRequest {
    userId: string;
    format: ExportFormat;
    dataType: DataType;
    startDate?: string;
    endDate?: string;
    categoryId?: number;
}

interface ExportFinancialDataUseCaseResponse {
    data: string;
    filename: string;
    contentType: string;
}

export class ExportFinancialDataUseCase {
    constructor(
        private expensesRepository: ExpensesRepository,
        private revenuesRepository: RevenuesRepository,
        private categoriesRepository: CategoriesRepository
    ) { }

    async execute({
        userId,
        format,
        dataType,
        startDate,
        endDate,
        categoryId,
    }: ExportFinancialDataUseCaseRequest): Promise<ExportFinancialDataUseCaseResponse> {
        // Obter categorias para mapear IDs para nomes
        const categories = await this.categoriesRepository.findMany();
        const categoryMap = new Map(categories.map(cat => [cat.id, cat.title]));

        // Obter dados financeiros com base no tipo solicitado
        let expenses: Expense[] = [];
        let revenues: Revenue[] = [];

        if (dataType === 'expenses' || dataType === 'all') {
            const result = await this.expensesRepository.findFiltered({
                page: 1,
                perPage: 10000, // Um número grande para obter todos os registros
                userId,
                startDate,
                endDate,
                category: categoryId,
            });
            expenses = result.expenses;
        }

        if (dataType === 'revenues' || dataType === 'all') {
            const result = await this.revenuesRepository.findFiltered({
                page: 1,
                perPage: 10000, // Um número grande para obter todos os registros
                userId,
                startDate,
                endDate,
                category: categoryId,
            });
            revenues = result.revenues;
        }

        // Preparar os dados para exportação
        const expenseData = expenses.map(expense => ({
            tipo: 'Despesa',
            descricao: expense.description,
            data: this.formatDate(expense.date),
            valor: expense.value.toNumber(),
            categoria: categoryMap.get(expense.categoryId) || 'Desconhecida',
            metodo_pagamento: expense.payment_method || 'Não especificado',
        }));

        const revenueData = revenues.map(revenue => ({
            tipo: 'Receita',
            descricao: revenue.description,
            data: this.formatDate(revenue.date),
            valor: revenue.value.toNumber(),
            categoria: categoryMap.get(revenue.categoryId) || 'Desconhecida',
            fonte_receita: revenue.income_source || 'Não especificada',
        }));

        // Combinar os dados conforme necessário
        const combinedData = [...expenseData, ...revenueData];

        // Ordenar por data (mais recente primeiro)
        combinedData.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        // Exportar no formato solicitado
        let data: string;
        let contentType: string;

        if (format === 'csv') {
            data = this.convertToCSV(combinedData);
            contentType = 'text/csv';
        } else {
            data = JSON.stringify(combinedData, null, 2);
            contentType = 'application/json';
        }

        // Gerar nome do arquivo
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `spendify_export_${dataType}_${dateStr}.${format}`;

        return {
            data,
            filename,
            contentType,
        };
    }

    private formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    private convertToCSV(data: any[]): string {
        if (data.length === 0) return '';

        // Obter cabeçalhos a partir das chaves do primeiro objeto
        const headers = Object.keys(data[0]);

        // Criar linha de cabeçalho do CSV
        let csvString = headers.join(',') + '\n';

        // Adicionar os dados
        data.forEach(item => {
            csvString += headers.map(header => {
                // Escapar aspas e adicionar aspas em torno de strings
                const value = item[header];
                if (typeof value === 'string') {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',') + '\n';
        });

        return csvString;
    }
} 
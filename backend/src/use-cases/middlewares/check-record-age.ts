import { OldRecordError } from "../../errors/old-record-error";

export function checkRecordAge(date: Date): void {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (date < sixMonthsAgo) {
        throw new OldRecordError();
    }
} 
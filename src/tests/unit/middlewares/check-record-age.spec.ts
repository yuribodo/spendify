import { describe, expect, it } from 'vitest';
import { OldRecordError } from '../../../errors/old-record-error';
import { checkRecordAge } from '../../../use-cases/middlewares/check-record-age';

describe('Check Record Age Middleware', () => {
    it('should not throw error for records less than 6 months old', () => {
        const currentDate = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

        expect(() => checkRecordAge(threeMonthsAgo)).not.toThrow();
    });

    it('should throw OldRecordError for records more than 6 months old', () => {
        const currentDate = new Date();
        const sevenMonthsAgo = new Date();
        sevenMonthsAgo.setMonth(currentDate.getMonth() - 7);

        expect(() => checkRecordAge(sevenMonthsAgo)).toThrow(OldRecordError);
    });

    it('should not throw error for records exactly 6 months old', () => {
        const currentDate = new Date();
        const sixMonthsAgo = new Date();


        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        sixMonthsAgo.setDate(currentDate.getDate());

        sixMonthsAgo.setMilliseconds(sixMonthsAgo.getMilliseconds() + 1);

        expect(() => checkRecordAge(sixMonthsAgo)).not.toThrow();
    });
}); 
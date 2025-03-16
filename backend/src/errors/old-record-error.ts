export class OldRecordError extends Error {
    constructor() {
        super('Cannot modify or delete financial records older than six months.');
        this.name = 'OldRecordError';
    }
} 
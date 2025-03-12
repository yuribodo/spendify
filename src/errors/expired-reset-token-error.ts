export class ExpiredResetTokenError extends Error {
    constructor() {
        super("Expired password reset token")
        this.name = "ExpiredResetTokenError";
    }
}
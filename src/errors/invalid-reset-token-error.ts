export class InvalidResetTokenError extends Error {
    constructor() {
        super("Invalid password reset token")
        this.name = "InvalidResetTokenError";
    }
}
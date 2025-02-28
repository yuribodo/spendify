import { ForgotPasswordUseCase } from "../forgot-password";

export function makeForgotPasswordUseCase() {
    const forgotPasswordUseCase = new ForgotPasswordUseCase()
    return forgotPasswordUseCase
}
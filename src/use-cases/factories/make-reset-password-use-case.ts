import { ResetPasswordUseCase } from "../reset-password";

export function makeResetPasswordUseCase() {
    const resetPasswordUseCase = new ResetPasswordUseCase()
    return resetPasswordUseCase
}
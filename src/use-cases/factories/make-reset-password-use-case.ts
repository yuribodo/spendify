import { ResetPasswordUseCase } from "../user-use-cases/reset-password"

export function makeResetPasswordUseCase() {
    const resetPasswordUseCase = new ResetPasswordUseCase()
    return resetPasswordUseCase
}
import { ResetPasswordUseCase } from "@/use-cases/user/reset-password"

export function makeResetPasswordUseCase() {
    const resetPasswordUseCase = new ResetPasswordUseCase()
    return resetPasswordUseCase
}
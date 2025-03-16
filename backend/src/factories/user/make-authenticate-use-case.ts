import { AuthenticateUseCase } from "@/use-cases/user/authenticate";

export function makeAuthenticateUseCase() {
    const authenticateUseCase = new AuthenticateUseCase();
    return authenticateUseCase
}
import { AuthenticateUseCase } from "../user-use-cases/authenticate";

export function makeAuthenticateUseCase() {
    const authenticateUseCase = new AuthenticateUseCase();
    return authenticateUseCase
}
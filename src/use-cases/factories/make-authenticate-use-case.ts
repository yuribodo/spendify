import { AuthenticateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
    const authenticateUseCase = new AuthenticateUseCase();
    return authenticateUseCase
}
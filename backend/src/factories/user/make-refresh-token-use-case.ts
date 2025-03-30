import { RefreshTokenUseCase } from "@/use-cases/user/refresh-token";

export function makeRefreshTokenUseCase() {
    const refreshTokenUseCase = new RefreshTokenUseCase();
    return refreshTokenUseCase;
}
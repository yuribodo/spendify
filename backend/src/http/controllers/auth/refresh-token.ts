import { FastifyReply, FastifyRequest } from "fastify";
import { makeRefreshTokenUseCase } from "@/factories/user/make-refresh-token-use-case";

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const refreshToken = request.cookies.accessToken;

    if (!refreshToken) {
      return reply.status(401).send({ message: "Token not provided" });
    }

    const refreshTokenUseCase = makeRefreshTokenUseCase();

    const { user } = await refreshTokenUseCase.execute({
      token: refreshToken,
    });

    const token = await reply.jwtSign(
      {
        role: "user",
      },
      {
        sign: {
          sub: user.id,
        },
      }
    );

    reply.setCookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return reply.status(200).send({
      token,
    });
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
}
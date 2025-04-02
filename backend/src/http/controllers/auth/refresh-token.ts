import { makeRefreshTokenUseCase } from "@/factories/user/make-refresh-token-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

interface JWTPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const refreshTokenUseCase = makeRefreshTokenUseCase();
    
    const currentToken = request.cookies.accessToken;
    
    if (!currentToken) {
      return reply.status(401).send({ message: "Refresh token not provided" });
    }

    const payload = await request.jwtVerify<JWTPayload>();
    const userId = payload.sub;
    
    const { user } = await refreshTokenUseCase.execute({
      userId,
    });

    const token = await reply.jwtSign(
      {
        role: "user",
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '15m', 
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
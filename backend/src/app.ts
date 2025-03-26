import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { env } from "./env/index";
import { appRoutes } from "./http/routes";
import fastifyCookie from '@fastify/cookie';


export const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
});

app.register(fastifyCookie, { });

// Configuração do Swagger
app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Spendify API',
      description: 'API to manage personal finances',
      version: '1.0.0'
    },
    host: 'localhost:3333',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'secret'
});

// Middleware para autenticação
app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "Token not found or Invalid" });
  }
});

// Registre as rotas da aplicação
app.register(appRoutes);

// Tratamento de erros
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: conectar com uma ferramenta externa como o Sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error' });
});

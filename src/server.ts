import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
const fastify = Fastify({
  logger: true
});

fastify.get('/', async function handler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return { hello: 'world' };
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

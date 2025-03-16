import { IncomingMessage, ServerResponse } from 'node:http';
import { app } from "./app";
import { env } from "./env";

// Inicializa o servidor localmente se não estiver no ambiente Vercel
if (!process.env.VERCEL) {
  app
    .listen({
      host: '0.0.0.0',
      port: env.PORT,
    })
    .then(() => {
      console.log(`HTTP Server running on port ${env.PORT} 🚀`);
    })
    .catch(err => {
      console.error("Erro ao iniciar o servidor:", err);
      process.exit(1);
    });
}

// Handler para o ambiente serverless da Vercel
const handler = async (req: IncomingMessage, res: ServerResponse) => {
  await app.ready();
  app.server.emit('request', req, res);
};

// Exportação para Vercel
export default handler;

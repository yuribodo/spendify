"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./env");
// Inicializa o servidor localmente se não estiver no ambiente Vercel
if (!process.env.VERCEL) {
    app_1.app
        .listen({
        host: '0.0.0.0',
        port: env_1.env.PORT,
    })
        .then(() => {
        console.log(`HTTP Server running on port ${env_1.env.PORT} 🚀`);
    })
        .catch(err => {
        console.error("Erro ao iniciar o servidor:", err);
        process.exit(1);
    });
}
// Handler para o ambiente serverless da Vercel
const handler = async (req, res) => {
    await app_1.app.ready();
    app_1.app.server.emit('request', req, res);
};
// Exportação para Vercel
exports.default = handler;

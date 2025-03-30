import { FastifyInstance } from "fastify";
import { authenticate } from "../controllers/auth/authenticate";
import { forgotPassword } from "../controllers/auth/forgot-password";
import { resetPassword } from "../controllers/auth/reset-password";
import { refreshToken } from "../controllers/auth/refresh-token";

export async function authRoutes(app: FastifyInstance) {
    app.post('/session', {
        schema: {
            description: 'Route to authenticate a user',
            tags: ['Authentication'],
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                }
            },
            response: {
                200: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        token: { type: 'string' }
                    }
                },
                401: {
                    description: 'Unauthorized - Invalid credentials',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, authenticate);

    app.post('/refresh', {
        schema: {
            description: 'Route to refresh authentication token',
            tags: ['Authentication'],
            response: {
                200: {
                    description: 'Successful token refresh',
                    type: 'object',
                    properties: {
                        token: { type: 'string' }
                    }
                },
                401: {
                    description: 'Unauthorized - Invalid or expired token',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, refreshToken);

    app.post('/forgot-password', {
        schema: {
            description: 'Route to request a password recovery',
            tags: ['Authentication'],
            body: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: { type: 'string', format: 'email' }
                }
            },
            response: {
                200: {
                    description: 'Recovery email sent',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                400: {
                    description: 'User not found',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, forgotPassword);

    app.post('/reset-password', {
        schema: {
            description: 'Route to reset the password',
            tags: ['Authentication'],
            body: {
                type: 'object',
                required: ['token', 'password'],
                properties: {
                    token: { type: 'string' },
                    password: { type: 'string', minLength: 6 }
                }
            },
            response: {
                200: {
                    description: 'Password successfully reset',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                400: {
                    description: 'Invalid or expired token',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, resetPassword);
}
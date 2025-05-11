// src/config/security.js
module.exports = {
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100 // límite de solicitudes por ventana
    },
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    }
};

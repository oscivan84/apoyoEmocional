// src/middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const config = require('../config/security');

const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente m�s tarde.',
    handler: (req, res) => {
        logger.warn('Rate limit excedido', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            error: 'Demasiadas solicitudes desde esta IP'
        });
    }
});

module.exports = limiter;

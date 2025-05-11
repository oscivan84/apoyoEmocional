// src/middlewares/cacheMiddleware.js
const cacheService = require('../services/cache/cacheService');
const logger = require('../utils/logger');

const cacheMiddleware = (ttl = 600) => async (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const key = cache_;

    try {
        const cachedResponse = await cacheService.get(key);
        
        if (cachedResponse) {
            logger.debug('Respuesta obtenida desde caché', { key });
            return res.json(cachedResponse);
        }

        // Modificar res.json para interceptar la respuesta
        const originalJson = res.json;
        res.json = function(body) {
            cacheService.set(key, body, ttl);
            return originalJson.call(this, body);
        };

        next();
    } catch (error) {
        logger.error('Error en middleware de caché', { error: error.message });
        next();
    }
};

module.exports = cacheMiddleware;

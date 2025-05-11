// src/middlewares/monitoringMiddleware.js
const metricsService = require('../monitoring/metricsService');
const logger = require('../utils/logger');

const monitoringMiddleware = () => (req, res, next) => {
    const start = Date.now();
    
    // Interceptar la finalización de la respuesta
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        // Trackear tiempo de respuesta
        metricsService.trackResponseTime(duration);
        
        // Trackear resultado basado en el código de estado
        const success = res.statusCode < 400;
        metricsService.trackMessage(success);
        
        if (!success) {
            metricsService.trackError(new Error(HTTP ));
        }
        
        // Log de la petición
        logger.info('Request processed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration
        });
    });
    
    next();
};

module.exports = monitoringMiddleware;

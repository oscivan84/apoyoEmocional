// Ejemplo de uso del logger
const logger = require('./utils/logger');

// Ejemplos de uso
logger.info('Aplicación iniciada');
logger.error('Error en la aplicación', { error: 'Detalles del error' });
logger.warn('Advertencia del sistema');
logger.debug('Información de depuración');

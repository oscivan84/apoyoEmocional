// src/services/cache/cacheService.js
const cacheManager = require('cache-manager');
const logger = require('../../utils/logger');

class CacheService {
    constructor() {
        this.memoryCache = cacheManager.caching({
            store: 'memory',
            max: 1000, // m�ximo n�mero de items
            ttl: 600 // tiempo de vida en segundos (10 minutos)
        });

        this.messageCache = cacheManager.caching({
            store: 'memory',
            max: 500,
            ttl: 300 // 5 minutos para mensajes
        });

        this.sessionCache = cacheManager.caching({
            store: 'memory',
            max: 200,
            ttl: 3600 // 1 hora para sesiones
        });
    }

    // Cach� general
    async get(key) {
        try {
            return await this.memoryCache.get(key);
        } catch (error) {
            logger.error('Error al obtener de cach�', { key, error: error.message });
            return null;
        }
    }

    async set(key, value, ttl = 600) {
        try {
            await this.memoryCache.set(key, value, { ttl });
            logger.debug('Valor guardado en cach�', { key });
        } catch (error) {
            logger.error('Error al guardar en cach�', { key, error: error.message });
        }
    }

    // Cach� espec�fico para mensajes
    async getMessage(phoneNumber) {
        try {
            return await this.messageCache.get(msg_);
        } catch (error) {
            logger.error('Error al obtener mensaje de cach�', { phoneNumber, error: error.message });
            return null;
        }
    }

    async setMessage(phoneNumber, messageData) {
        try {
            await this.messageCache.set(msg_, messageData);
            logger.debug('Mensaje guardado en cach�', { phoneNumber });
        } catch (error) {
            logger.error('Error al guardar mensaje en cach�', { phoneNumber, error: error.message });
        }
    }

    // Cach� de sesiones
    async getSession(sessionId) {
        try {
            return await this.sessionCache.get(session_);
        } catch (error) {
            logger.error('Error al obtener sesi�n de cach�', { sessionId, error: error.message });
            return null;
        }
    }

    async setSession(sessionId, sessionData) {
        try {
            await this.sessionCache.set(session_, sessionData);
            logger.debug('Sesi�n guardada en cach�', { sessionId });
        } catch (error) {
            logger.error('Error al guardar sesi�n en cach�', { sessionId, error: error.message });
        }
    }

    // Utilidades
    async del(key) {
        try {
            await this.memoryCache.del(key);
            logger.debug('Clave eliminada de cach�', { key });
        } catch (error) {
            logger.error('Error al eliminar de cach�', { key, error: error.message });
        }
    }

    async reset() {
        try {
            await this.memoryCache.reset();
            await this.messageCache.reset();
            await this.sessionCache.reset();
            logger.info('Cach� reiniciado completamente');
        } catch (error) {
            logger.error('Error al reiniciar cach�', { error: error.message });
        }
    }

    // M�tricas de cach�
    async getMetrics() {
        const metrics = {
            generalCache: await this.memoryCache.store.keys(),
            messageCache: await this.messageCache.store.keys(),
            sessionCache: await this.sessionCache.store.keys()
        };
        return {
            generalCacheSize: metrics.generalCache.length,
            messageCacheSize: metrics.messageCache.length,
            sessionCacheSize: metrics.sessionCache.length,
            totalItems: metrics.generalCache.length + metrics.messageCache.length + metrics.sessionCache.length
        };
    }
}

module.exports = new CacheService();

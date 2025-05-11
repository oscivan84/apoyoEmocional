// src/utils/sessionCacheUtil.js
const cacheService = require('../services/cache/cacheService');
const logger = require('../utils/logger');

class SessionCacheUtil {
    static async getOrCreateSession(sessionId) {
        try {
            let session = await cacheService.getSession(sessionId);
            
            if (!session) {
                session = {
                    id: sessionId,
                    createdAt: new Date().toISOString(),
                    lastActivity: new Date().toISOString(),
                    data: {}
                };
                await cacheService.setSession(sessionId, session);
            }
            
            return session;
        } catch (error) {
            logger.error('Error en getOrCreateSession', { sessionId, error: error.message });
            throw error;
        }
    }

    static async updateSessionData(sessionId, data) {
        try {
            const session = await this.getOrCreateSession(sessionId);
            const updatedSession = {
                ...session,
                lastActivity: new Date().toISOString(),
                data: { ...session.data, ...data }
            };
            
            await cacheService.setSession(sessionId, updatedSession);
            return updatedSession;
        } catch (error) {
            logger.error('Error en updateSessionData', { sessionId, error: error.message });
            throw error;
        }
    }

    static async clearSession(sessionId) {
        try {
            await cacheService.del(session_);
            logger.info('Sesión eliminada', { sessionId });
        } catch (error) {
            logger.error('Error al limpiar sesión', { sessionId, error: error.message });
            throw error;
        }
    }
}

module.exports = SessionCacheUtil;

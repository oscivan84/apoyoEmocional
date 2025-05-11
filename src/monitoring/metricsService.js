// src/monitoring/metricsService.js
const logger = require('../utils/logger');

class MetricsService {
    constructor() {
        this.metrics = {
            messages: {
                total: 0,
                success: 0,
                failed: 0,
                lastMinute: 0
            },
            performance: {
                responseTime: [],
                averageResponseTime: 0
            },
            errors: {
                count: 0,
                lastError: null
            },
            database: {
                queries: 0,
                errors: 0,
                averageQueryTime: 0
            },
            cache: {
                hits: 0,
                misses: 0,
                ratio: 0
            },
            sessions: {
                active: 0,
                total: 0
            }
        };

        // Limpiar métricas por minuto
        setInterval(() => this.resetMinuteMetrics(), 60000);
    }

    // Métricas de mensajes
    trackMessage(success = true) {
        this.metrics.messages.total++;
        this.metrics.messages.lastMinute++;
        if (success) {
            this.metrics.messages.success++;
        } else {
            this.metrics.messages.failed++;
        }
    }

    // Métricas de rendimiento
    trackResponseTime(time) {
        this.metrics.performance.responseTime.push(time);
        if (this.metrics.performance.responseTime.length > 100) {
            this.metrics.performance.responseTime.shift();
        }
        this.updateAverageResponseTime();
    }

    // Métricas de errores
    trackError(error) {
        this.metrics.errors.count++;
        this.metrics.errors.lastError = {
            message: error.message,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };
        logger.error('Error tracked', { error: error.message });
    }

    // Métricas de base de datos
    trackDatabaseQuery(time) {
        this.metrics.database.queries++;
        this.updateAverageDatabaseTime(time);
    }

    trackDatabaseError() {
        this.metrics.database.errors++;
    }

    // Métricas de caché
    trackCacheHit() {
        this.metrics.cache.hits++;
        this.updateCacheRatio();
    }

    trackCacheMiss() {
        this.metrics.cache.misses++;
        this.updateCacheRatio();
    }

    // Métricas de sesiones
    trackSession(active = true) {
        if (active) {
            this.metrics.sessions.active++;
        } else {
            this.metrics.sessions.active = Math.max(0, this.metrics.sessions.active - 1);
        }
        this.metrics.sessions.total++;
    }

    // Utilidades privadas
    private updateAverageResponseTime() {
        const sum = this.metrics.performance.responseTime.reduce((a, b) => a + b, 0);
        this.metrics.performance.averageResponseTime = sum / this.metrics.performance.responseTime.length;
    }

    private updateAverageDatabaseTime(time) {
        const currentAvg = this.metrics.database.averageQueryTime;
        const currentQueries = this.metrics.database.queries;
        this.metrics.database.averageQueryTime = 
            (currentAvg * (currentQueries - 1) + time) / currentQueries;
    }

    private updateCacheRatio() {
        const total = this.metrics.cache.hits + this.metrics.cache.misses;
        this.metrics.cache.ratio = total > 0 ? this.metrics.cache.hits / total : 0;
    }

    private resetMinuteMetrics() {
        this.metrics.messages.lastMinute = 0;
    }

    // Obtener métricas
    getMetrics() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString()
        };
    }

    // Generar reporte
    generateReport() {
        const metrics = this.getMetrics();
        return {
            summary: {
                totalMessages: metrics.messages.total,
                successRate: (metrics.messages.success / metrics.messages.total) * 100,
                averageResponseTime: metrics.performance.averageResponseTime,
                errorRate: (metrics.errors.count / metrics.messages.total) * 100,
                cacheHitRate: metrics.cache.ratio * 100,
                activeSessions: metrics.sessions.active
            },
            details: metrics
        };
    }
}

module.exports = new MetricsService();

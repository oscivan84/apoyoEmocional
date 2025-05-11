// src/services/databaseService.js
const { Pool } = require('pg');
const logger = require('../utils/logger');
const config = require('../config/database');

class DatabaseService {
    constructor() {
        this.pool = new Pool(config);
        this.pool.on('error', (err) => {
            logger.error('Error inesperado en el pool de base de datos', { error: err.message });
        });
    }

    async query(text, params) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            logger.debug('Ejecución de consulta', {
                text,
                duration,
                rows: res.rowCount
            });
            return res;
        } catch (err) {
            logger.error('Error en consulta de base de datos', {
                text,
                error: err.message
            });
            throw err;
        }
    }

    async guardarMensaje(telefono, mensaje, respuesta, estadoFlujo) {
        const query = 
            INSERT INTO mensajes (telefono, mensaje, respuesta, estado_flujo)
            VALUES (, , , )
            RETURNING id
        ;
        return this.query(query, [telefono, mensaje, respuesta, estadoFlujo]);
    }

    async obtenerMensajesRecientes(telefono, limite = 10) {
        const query = 
            SELECT *
            FROM mensajes
            WHERE telefono = 
            ORDER BY fecha_creacion DESC
            LIMIT 
        ;
        return this.query(query, [telefono, limite]);
    }

    async actualizarCache(patron, respuesta) {
        const query = 
            INSERT INTO respuestas_cache (patron_mensaje, respuesta, contador_uso)
            VALUES (, , 1)
            ON CONFLICT (patron_mensaje)
            DO UPDATE SET
                contador_uso = respuestas_cache.contador_uso + 1,
                ultima_actualizacion = CURRENT_TIMESTAMP
        ;
        return this.query(query, [patron, respuesta]);
    }

    async ejecutarMantenimiento() {
        const maintenanceScript = await fs.readFile(
            path.join(__dirname, '../database/scripts/maintenance.sql'),
            'utf8'
        );
        return this.query(maintenanceScript);
    }
}

module.exports = new DatabaseService();

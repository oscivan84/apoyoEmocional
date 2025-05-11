// src/database/runMigrations.js
const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
const config = require('../config/database');
const logger = require('../utils/logger');

async function runMigrations() {
    const pool = new Pool(config);
    
    try {
        // Crear tabla de control de migraciones si no existe
        await pool.query(
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        );

        // Leer archivos de migración
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = await fs.readdir(migrationsDir);
        const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

        // Ejecutar migraciones
        for (const file of sqlFiles) {
            const migrationName = file.replace('.sql', '');
            
            // Verificar si la migración ya fue ejecutada
            const { rows } = await pool.query(
                'SELECT id FROM migrations WHERE name = ',
                [migrationName]
            );

            if (rows.length === 0) {
                const sql = await fs.readFile(
                    path.join(migrationsDir, file),
                    'utf8'
                );

                await pool.query(sql);
                await pool.query(
                    'INSERT INTO migrations (name) VALUES ()',
                    [migrationName]
                );

                logger.info(Migración ejecutada: );
            }
        }

        logger.info('Todas las migraciones han sido ejecutadas');
    } catch (error) {
        logger.error('Error ejecutando migraciones', { error: error.message });
        throw error;
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    runMigrations().catch(console.error);
}

module.exports = runMigrations;

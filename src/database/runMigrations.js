// src/database/runMigrations.js
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigration() {
    console.log('?? Ejecutando migraciones...');
    
    try {
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Ordenar para ejecutar en secuencia
        
        const client = await pool.connect();
        
        try {
            for (const file of migrationFiles) {
                console.log(`?? Ejecutando migración: ${file}`);
                const sqlPath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(sqlPath, 'utf8');
                
                await client.query('BEGIN');
                await client.query(sql);
                await client.query('COMMIT');
                
                console.log(`? Migración completada: ${file}`);
            }
        } finally {
            client.release();
        }
        
        console.log('? Todas las migraciones completadas exitosamente');
    } catch (error) {
        console.error('? Error ejecutando migraciones:', error);
        process.exit(1);
    }
}

runMigration().then(() => {
    console.log('? Proceso de migración finalizado');
    process.exit(0);
});

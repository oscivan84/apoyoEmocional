// src/database/runMigrations.js
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigration() {
    console.log('🔄 Ejecutando migración para actualizar tabla interacciones...');
    
    try {
        const sqlPath = path.join(__dirname, 'scripts', 'update_interacciones_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        const client = await pool.connect();
        try {
            await client.query(sql);
            console.log('✅ Migración completada exitosamente');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ Error ejecutando migración:', error);
        process.exit(1);
    }
}

runMigration().then(() => {
    console.log('✅ Proceso de migración finalizado');
    process.exit(0);
});
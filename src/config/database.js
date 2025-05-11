// src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'portIvan*.2015',
    database: 'botwsp13',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Agregar listener para errores de conexión
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de BD:', err);
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('✅ Test de conexión exitoso:', result.rows[0]);
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Error en test de conexión:', error);
        return false;
    }
};

module.exports = { pool, testConnection };

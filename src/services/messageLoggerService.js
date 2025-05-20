const { Pool } = require('pg');
const dbConfig = require('../config/db');

const pool = new Pool(dbConfig);

async function logIncomingMessage({ from, message, flowState }) {
    try {
        const result = await pool.query(
            `INSERT INTO mensajes_entrantes (telefono, mensaje, estado_flujo, fecha)
             VALUES ($1, $2, $3, NOW())
             RETURNING id`,
            [from, message, flowState]
        );
        console.log(`Mensaje registrado con ID: ${result.rows[0].id}`);
        return result.rows[0];
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        throw error;
    }
}

module.exports = {
    logIncomingMessage
};

// src/services/messageService.js
const { pool } = require('../config/database');

class MessageService {
    async saveMessage(numeroTelefono, mensaje, respuesta = null) {
        console.log('\n?? Iniciando guardado de mensaje en BD');
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            console.log('?? Transacción iniciada');

            // Verificar si la tabla existe
            const tableCheck = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'interacciones'
                );
            `);

            // Si la tabla no existe, crearla
            if (!tableCheck.rows[0].exists) {
                console.log('?? Creando tabla interacciones...');
                await client.query(`
                    CREATE TABLE interacciones (
                        id SERIAL PRIMARY KEY,
                        numero_telefono VARCHAR(20) NOT NULL,
                        mensaje TEXT NOT NULL,
                        respuesta TEXT,
                        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                `);
            }

            const query = `
                INSERT INTO interacciones (numero_telefono, mensaje, respuesta)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            
            console.log('?? Ejecutando insert...');
            const result = await client.query(query, [numeroTelefono, mensaje, respuesta]);
            
            await client.query('COMMIT');
            console.log('? Mensaje guardado exitosamente');
            
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('? Error al guardar mensaje:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async updateMessageResponse(numeroTelefono, mensaje, respuesta) {
        console.log('\n?? Actualizando respuesta en BD');
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const query = `
                UPDATE interacciones 
                SET respuesta = $3
                WHERE numero_telefono = $1 AND mensaje = $2
                RETURNING *;
            `;
            const result = await client.query(query, [numeroTelefono, mensaje, respuesta]);
            await client.query('COMMIT');
            console.log('? Respuesta actualizada exitosamente');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('? Error al actualizar respuesta:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

// Exportar una instancia de la clase
module.exports = new MessageService();
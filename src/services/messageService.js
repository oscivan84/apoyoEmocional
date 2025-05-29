// src/services/messageService.js
const { pool } = require('../config/database');
const voiceTranscriptionService = require('./voiceTranscriptionService');

class MessageService {
    async saveMessage(numeroTelefono, mensaje, respuesta = null, estadoFlujo = null, idSesion = null, metadata = {}) {
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

            // Si la tabla no existe, crearla con soporte para mensajes de voz
            if (!tableCheck.rows[0].exists) {
                console.log('?? Creando tabla interacciones...');
                await client.query(`
                    CREATE TABLE interacciones (
                        id SERIAL PRIMARY KEY,
                        numero_telefono VARCHAR(20) NOT NULL,
                        mensaje TEXT NOT NULL,
                        respuesta TEXT,
                        estado_flujo TEXT,
                        id_sesion VARCHAR(100),
                        tipo_mensaje VARCHAR(20) DEFAULT 'text',
                        archivo_audio TEXT,
                        transcripcion TEXT,
                        duracion_audio INTEGER DEFAULT 0,
                        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                `);
            }

            // Procesar mensaje de voz si es necesario
            let tipoMensaje = metadata.type || 'text';
            let archivoAudio = null;
            let transcripcion = null;
            let duracionAudio = 0;

            if (tipoMensaje === 'voice' && metadata.messageObj) {
                try {
                    console.log('?? Procesando mensaje de voz...');
                    
                    // 1. Descargar el archivo de audio
                    const voiceData = await voiceTranscriptionService.downloadVoiceMessage(
                        metadata.messageObj,
                        metadata.client
                    );
                    
                    archivoAudio = voiceData.filePath;
                    duracionAudio = voiceData.duration || metadata.duration || 0;
                    
                    // 2. Transcribir el audio a texto
                    transcripcion = await voiceTranscriptionService.transcribeAudio(archivoAudio);
                    
                    console.log(`? Mensaje de voz procesado: "${transcripcion}"`);
                } catch (voiceError) {
                    console.error('? Error procesando mensaje de voz:', voiceError);
                    transcripcion = '[Error al procesar mensaje de voz]';
                }
            }

            // Guardar en la base de datos
            const query = `
                INSERT INTO interacciones (
                    numero_telefono, 
                    mensaje, 
                    respuesta, 
                    estado_flujo, 
                    id_sesion,
                    tipo_mensaje,
                    archivo_audio,
                    transcripcion,
                    duracion_audio,
                    fecha_creacion
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
                RETURNING *;
            `;
            
            console.log('?? Ejecutando insert...');
            const result = await client.query(query, [
                numeroTelefono, 
                mensaje, 
                respuesta, 
                estadoFlujo,
                idSesion,
                tipoMensaje,
                archivoAudio,
                transcripcion,
                duracionAudio
            ]);
            
            await client.query('COMMIT');
            console.log('? Mensaje guardado exitosamente');
            
            // Limpiar archivo temporal si existe
            if (archivoAudio) {
                await voiceTranscriptionService.cleanupTempFile(archivoAudio);
            }
            
            // Devolver el resultado con la transcripción para enviar a n8n
            const savedMessage = result.rows[0];
            if (tipoMensaje === 'voice' && transcripcion) {
                savedMessage.transcripcion = transcripcion;
            }
            
            return savedMessage;
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

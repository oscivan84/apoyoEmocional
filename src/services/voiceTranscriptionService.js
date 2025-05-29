// src/services/voiceTranscriptionService.js
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const { createTempDir } = require('../utils/fileUtil');
const axios = require('axios');
const FormData = require('form-data');

class VoiceTranscriptionService {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp');
        createTempDir(this.tempDir);
        
        // URL de la API de Whisper (puede ser configurada desde variables de entorno)
        this.whisperApiUrl = process.env.WHISPER_API_URL || 'https://api.openai.com/v1/audio/transcriptions';
        this.whisperApiKey = process.env.WHISPER_API_KEY;
    }

    async downloadVoiceMessage(message, client) {
        try {
            console.log('?? Descargando mensaje de voz...');
            
            const stream = await downloadMediaMessage(
                message,
                'buffer',
                {},
                { logger: console, client }
            );

            const filename = `voice_${Date.now()}.ogg`;
            const filePath = path.join(this.tempDir, filename);
            fs.writeFileSync(filePath, stream);
            
            console.log(`? Mensaje de voz guardado en: ${filePath}`);
            
            return {
                filePath,
                filename,
                mimeType: message.mimetype || 'audio/ogg',
                duration: message.seconds || 0
            };
        } catch (error) {
            console.error('? Error descargando mensaje de voz:', error);
            throw new Error(`Error al descargar mensaje de voz: ${error.message}`);
        }
    }

    async transcribeAudio(filePath) {
        try {
            console.log('?? Iniciando transcripción de audio...');
            
            // Si no hay API key configurada, devolver texto genérico
            if (!this.whisperApiKey) {
                console.log('?? No se encontró API key para Whisper, devolviendo texto genérico');
                return "[Transcripción no disponible - API key no configurada]";
            }
            
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));
            formData.append('model', 'whisper-1');
            formData.append('language', 'es');
            
            const response = await axios.post(this.whisperApiUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${this.whisperApiKey}`
                }
            });
            
            const transcription = response.data.text;
            console.log(`? Transcripción completada: "${transcription}"`);
            
            return transcription;
        } catch (error) {
            console.error('? Error en la transcripción:', error);
            return "[Error en la transcripción]";
        }
    }

    async cleanupTempFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`?? Archivo temporal eliminado: ${filePath}`);
            }
        } catch (error) {
            console.error('?? Error eliminando archivo temporal:', error);
        }
    }
}

module.exports = new VoiceTranscriptionService();

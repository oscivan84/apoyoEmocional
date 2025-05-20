// src/utils/messageUtil.js
const path = require('path');
const fs = require('fs').promises;

/**
 * Procesa y clasifica diferentes tipos de mensajes
 */
class MessageUtil {
    /**
     * Detecta el tipo de mensaje y lo procesa adecuadamente
     * @param {Object} ctx - Contexto del mensaje
     * @returns {Object} Mensaje procesado
     */
    static async processMessage(ctx) {
        const messageType = this.getMessageType(ctx);
        const processedMessage = {
            type: messageType,
            content: '',
            metadata: {}
        };

        switch (messageType) {
            case 'voice':
                processedMessage.content = 'Nota de voz recibida';
                processedMessage.metadata = {
                    duration: ctx.message?.duration || 0,
                    mimeType: ctx.message?.mimetype || 'audio/ogg',
                    id: this.extractVoiceNoteId(ctx.body)
                };
                break;
            case 'text':
                processedMessage.content = ctx.body;
                break;
            default:
                processedMessage.content = ctx.body;
                processedMessage.type = 'unknown';
        }

        return processedMessage;
    }

    /**
     * Determina el tipo de mensaje
     * @param {Object} ctx - Contexto del mensaje
     * @returns {string} Tipo de mensaje
     */
    static getMessageType(ctx) {
        if (ctx.body && ctx.body.includes('_event_voice_note__')) {
            return 'voice';
        }
        return 'text';
    }

    /**
     * Extrae el ID de la nota de voz del mensaje
     * @param {string} message - Mensaje original
     * @returns {string} ID de la nota de voz
     */
    static extractVoiceNoteId(message) {
        const match = message.match(/_event_voice_note__([a-f0-9-]+)/);
        return match ? match[1] : '';
    }
}

module.exports = MessageUtil;

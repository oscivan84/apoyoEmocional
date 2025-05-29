// src/utils/messageUtil.js
const path = require('path');
const fs = require('fs');

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
                processedMessage.content = '[mensaje de voz]';
                processedMessage.metadata = {
                    duration: ctx.message?.seconds || 0,
                    mimeType: ctx.message?.mimetype || 'audio/ogg',
                    id: this.extractVoiceNoteId(ctx.body || ''),
                    messageObj: ctx.message // Incluir el objeto de mensaje completo para descarga
                };
                break;
            case 'text':
                processedMessage.content = ctx.body || '';
                break;
            default:
                processedMessage.content = ctx.body || '';
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
        // Detectar mensajes de voz por diferentes métodos
        if (
            ctx.message?.audioMessage || 
            ctx.message?.pttMessage || 
            (ctx.message && ctx.message.mimetype && ctx.message.mimetype.includes('audio')) ||
            (ctx.body && typeof ctx.body === 'string' && ctx.body.includes('_event_voice_note__'))
        ) {
            return 'voice';
        }
        
        // Detectar mensajes de texto
        if (
            ctx.message?.conversation || 
            ctx.message?.extendedTextMessage || 
            (ctx.body && typeof ctx.body === 'string')
        ) {
            return 'text';
        }
        
        return 'unknown';
    }

    /**
     * Extrae el ID de la nota de voz del mensaje
     * @param {string} message - Mensaje original
     * @returns {string} ID de la nota de voz
     */
    static extractVoiceNoteId(message) {
        if (typeof message !== 'string') return '';
        const match = message.match(/_event_voice_note__([a-f0-9-]+)/);
        return match ? match[1] : '';
    }
}

module.exports = MessageUtil;

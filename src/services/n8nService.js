// src/services/n8nService.js
const axios = require('axios');
const MessageUtil = require('../utils/messageUtil');

class N8NService {
    constructor() {
        this.webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/whatsapp';
    }

    async sendToN8N(from, message, originalContext = null) {
        console.log('\n?? [N8N] Preparando envío:', { from, message });

        let processedMessage = message;
        let messageType = 'text';
        let metadata = {};
        let transcripcion = null;

        // Procesar el mensaje si tenemos el contexto original
        if (originalContext) {
            const processed = await MessageUtil.processMessage(originalContext);
            processedMessage = processed.content;
            messageType = processed.type;
            metadata = processed.metadata;
            
            // Si es un mensaje de voz y tiene transcripción, usarla
            if (messageType === 'voice' && originalContext.transcripcion) {
                transcripcion = originalContext.transcripcion;
                console.log(`?? [N8N] Usando transcripción: "${transcripcion}"`);
            }
        }

        const payload = {
            from,
            message: messageType === 'voice' && transcripcion ? transcripcion : processedMessage,
            originalMessage: processedMessage,
            messageType,
            metadata: {
                ...metadata,
                transcripcion
            },
            timestamp: new Date().toISOString()
        };

        try {
            console.log('?? [N8N] Enviando a:', this.webhookUrl);
            console.log('?? [N8N] Payload:', JSON.stringify(payload, null, 2));

            const response = await axios({
                method: 'POST',
                url: this.webhookUrl,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            console.log('? [N8N] Respuesta recibida');
            return response.data;

        } catch (error) {
            console.error('? [N8N] Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(`Error enviando a n8n: ${error.message}`);
        }
    }
}

module.exports = new N8NService();

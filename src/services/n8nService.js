// src/services/n8nService.js
const axios = require('axios');

class N8NService {
    constructor() {
        // URL de n8n - Asegúrate de que esta URL sea correcta
        this.webhookUrl = 'http://localhost:5678/webhook-test/whatsapp';
    }

    async sendToN8N(from, message) {
        console.log('\n🔄 [N8N] Preparando envío:', { from, message });

        const payload = {
            from: from,
            message: message,
            timestamp: new Date().toISOString()
        };

        try {
            console.log('📤 [N8N] Enviando a:', this.webhookUrl);
            

            const response = await axios({
                method: 'POST',
                url: this.webhookUrl,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            console.log('✅ [N8N] Respuesta recibida');

            return response.data;

        } catch (error) {
            console.error('❌ [N8N] Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(`Error enviando a n8n: ${error.message}`);
        }
    }
}

module.exports = new N8NService();

// src/webhook.js
const express = require('express');
const router = express.Router();
const n8nService = require('./services/n8nService');
const logger = require('./utils/logger');

// Middleware para logging
router.use((req, res, next) => {
    console.log(\n📥 Nueva petición:  );
    next();
});

// Ruta del webhook
router.post('/webhook', async (req, res) => {
    console.log('\n🔔 Webhook recibido');
    
    try {
        const { sender, message } = req.body;

        // Validación de datos
        if (!sender || !message) {
            console.log('❌ Datos inválidos recibidos');
            return res.status(400).json({
                error: 'sender y message son requeridos'
            });
        }

        console.log('📨 Mensaje a procesar:', { sender, message });

        // Enviar a n8n
        try {
            console.log('🔄 Intentando enviar a n8n...');
            const n8nResponse = await n8nService.sendToN8N(sender, message);
            console.log('✅ Respuesta de n8n:', n8nResponse);

            res.json({
                success: true,
                n8nResponse
            });
        } catch (n8nError) {
            console.error('❌ Error enviando a n8n:', n8nError.message);
            res.status(500).json({
                error: 'Error al enviar a n8n',
                details: n8nError.message
            });
        }

    } catch (error) {
        console.error('❌ Error general:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

module.exports = router;

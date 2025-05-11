// app.js
const express = require('express');
const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const JsonFileAdapter = require('@bot-whatsapp/database/json');
const { pool } = require('./src/config/database');
const messageService = require('./src/services/messageService');
const n8nService = require('./src/services/n8nService');

const app = express();
app.use(express.json());

// Función para manejar mensajes
const handleMessage = async (from, message) => {
    console.log('\n📨 Nuevo mensaje recibido:', { from, message });

    try {
        // 1. Guardar en BD
        const savedMessage = await messageService.saveMessage(from, message);
        console.log('💾 Mensaje guardado en BD:', savedMessage);

        // 2. Enviar a n8n
        try {
            console.log('🔄 Intentando enviar a n8n...');
            const n8nResponse = await n8nService.sendToN8N(from, message);
            console.log('✅ Mensaje enviado a n8n:', n8nResponse);
            return n8nResponse;
        } catch (n8nError) {
            console.error('❌ Error enviando a n8n:', n8nError.message);
            throw n8nError;
        }
    } catch (error) {
        console.error('❌ Error procesando mensaje:', error);
        throw error;
    }
};

const main = async () => {
    const adapterDB = new JsonFileAdapter();
    const adapterFlow = createFlow([]);
    const adapterProvider = createProvider(BaileysProvider);

    // Manejar mensajes de WhatsApp
    adapterProvider.on('message', async (msg) => {
        if (msg.from === 'status@broadcast' || msg.from === adapterProvider.number) return;

        try {
            const response = await handleMessage(msg.from, msg.body);
            console.log('✅ Mensaje procesado completamente:', response);
        } catch (error) {
            console.error('❌ Error en el procesamiento:', error.message);
        }
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

// Ruta webhook
app.post('/webhook', async (req, res) => {
    try {
        const { from, body, message, sender } = req.body;
        const senderNumber = from || sender;
        const messageText = body || message;

        if (!senderNumber || !messageText) {
            return res.status(400).json({
                error: 'Datos incompletos'
            });
        }

        const response = await handleMessage(senderNumber, messageText);
        res.json({ success: true, response });

    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    main().catch(console.error);
});

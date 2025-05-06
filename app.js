const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const JsonFileAdapter = require('@bot-whatsapp/database/json');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3080;
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/whatsapp';

let adapterProvider;
let adapterDB;

// Función para enviar mensajes a n8n
async function sendMessageToN8N(sender, message) {
    try {
        const response = await axios.post(N8N_WEBHOOK_URL, {
            sender: sender,
            message: message
        });
        console.log('🤖 Enviado a Agente', { sender, message });
        return response.data;
    } catch (error) {
        console.error('❌ Error enviando a n8n:', error.message);



        
    }
}

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-webhook-token'];
    if (!token || token !== process.env.WEBHOOK_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Configuración del webhook para recibir mensajes de n8n
const setupWebhook = (provider) => {
    app.use(express.json());
    
    app.post('/api/n8n-webhook', authMiddleware, async (req, res) => {
        try {
            const { action, data } = req.body;
            console.log('📥 Recibida petición de n8n:', { action, data });
            
            switch (action) {
                case 'send_message':
                    const { phone, message } = data;
                    if (!phone || !message) {
                        console.log('❌ Error: Faltan datos', { phone, message });
                        return res.status(400).json({ error: 'Missing phone or message' });
                    }

                    const formattedPhone = phone.includes('@s.whatsapp.net') 
                        ? phone 
                        : `${phone}@s.whatsapp.net`;

                    console.log('📤 Intentando enviar mensaje a:', formattedPhone);

                    try {
                        await provider.getInstance().sendMessage(formattedPhone, {
                            text: message
                        });
                        
                        console.log('✅ Mensaje enviado exitosamente');
                        res.json({ success: true, message: 'Mensaje enviado' });
                    } catch (error) {
                        console.error('❌ Error enviando mensaje:', error);
                        res.status(500).json({ 
                            error: 'Error enviando mensaje',
                            details: error.message 
                        });
                    }
                    break;

                default:
                    console.log('❌ Acción no soportada:', action);
                    return res.status(400).json({ error: 'Action not supported' });
            }
        } catch (error) {
            console.error('❌ Error general en webhook:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor',
                details: error.message 
            });
        }
    });
};

const main = async () => {
    try {
        adapterDB = new JsonFileAdapter();
        const adapterFlow = createFlow([]); // Sin flows

        adapterProvider = createProvider(BaileysProvider);

        const bot = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });

        setupWebhook(adapterProvider);

        adapterProvider.on('message', async (msg) => {
            if (msg.from === 'status@broadcast' || msg.from === adapterProvider.number) return;

            const sender = msg.from;
            const text = msg.body;

            if (!text) return;

            console.log(`📨 Mensaje recibido de ${sender}: ${text}`);
            await sendMessageToN8N(sender, text);
        });

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📲 Webhook listo para recibir peticiones de n8n`);
        });

    } catch (error) {
        console.error('Error iniciando el bot:', error);
    }
};

main();

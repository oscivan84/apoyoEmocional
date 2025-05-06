// En tu archivo app.js o donde uses el webhook
const { router: webhookRouter, messageLogger } = require('./src/webhook');

// Usar el router
app.use('/api', webhookRouter);

// Ejemplo de uso del messageLogger en el manejador de mensajes
adapterProvider.on('message', async (msg) => {
    if (msg.from === 'status@broadcast' || msg.from === adapterProvider.number) return;

    const sender = msg.from;
    const text = msg.body;

    if (!text) return;

    console.log(`📨 Mensaje recibido de ${sender}: ${text}`);
    
    // Enviar a n8n
    const response = await sendMessageToN8N(sender, text);
    
    // Registrar la interacción en la base de datos
    await messageLogger(sender, text, response?.message || '');
});

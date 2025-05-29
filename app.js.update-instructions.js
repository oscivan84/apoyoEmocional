// Actualización para app.js - Función handleMessage
const handleMessage = async (from, message, flowState = null, originalMessage = null) => {
    console.log('\n?? Nuevo mensaje recibido:', { from, message, flowState });

    try {
        // Generar ID de sesión si no existe
        const sessionId = `session_${Date.now()}_${from}`;
        
        // Procesar el mensaje y obtener metadata
        const processedMessage = await MessageUtil.processMessage({
            body: message,
            message: originalMessage,
            from
        });

        // 1. Guardar en BD con estado del flujo y metadata
        const savedMessage = await messageService.saveMessage(
            from, 
            processedMessage.content, 
            null, // respuesta inicial
            flowState,
            sessionId,
            {
                type: processedMessage.type,
                messageObj: originalMessage,
                client: globalProvider?.vendor,
                duration: processedMessage.metadata.duration,
                ...processedMessage.metadata
            }
        );
        console.log('?? Mensaje guardado en BD:', savedMessage);

        // 2. Enviar a n8n con contexto completo y transcripción si existe
        try {
            console.log('?? Intentando enviar a n8n...');
            const n8nResponse = await n8nService.sendToN8N(from, message, {
                body: message,
                from,
                flowState,
                sessionId,
                transcripcion: savedMessage.transcripcion,
                messageType: processedMessage.type,
                metadata: processedMessage.metadata
            });
            console.log('? Mensaje enviado a n8n:', n8nResponse);
            return n8nResponse;
        } catch (n8nError) {
            console.error('? Error enviando a n8n:', n8nError.message);
            throw n8nError;
        }
    } catch (error) {
        console.error('? Error procesando mensaje:', error);
        throw error;
    }
};

// Actualización para app.js - Event listener de mensajes
adapterProvider.on('message', async (msg) => {
    if (msg.from === 'status@broadcast' || msg.from === adapterProvider.number) return;

    try {
        // Pasar el mensaje completo para procesar audio si existe
        const response = await handleMessage(msg.from, msg.body, null, msg);
        console.log('? Mensaje procesado completamente:', response);
    } catch (error) {
        console.error('? Error en el procesamiento:', error.message);
    }
});

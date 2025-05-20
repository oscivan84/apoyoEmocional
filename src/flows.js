const { addKeyword } = require('@bot-whatsapp/bot');
const { logIncomingMessage } = require('./services/messageLoggerService');
const n8nService = require('./services/n8nService');

const flujoPrincipal = addKeyword(['hola', 'buenas', 'info'])
    .addAction(async (ctx, { flowDynamic, state }) => {
        const userPhone = ctx.from;
        const message = ctx.body;
        const currentState = await state.get('current') || 'inicio';

        try {
            // Registrar mensaje con contexto completo
            await logIncomingMessage({
                from: userPhone,
                message,
                flowState: currentState,
                context: ctx
            });

            // Enviar a n8n con contexto completo
            await n8nService.sendToN8N(userPhone, message, ctx);

            await flowDynamic('¡Hola! ¿En qué te puedo ayudar hoy? 😊');
        } catch (error) {
            console.error('❌ Error en el flujo principal:', error);
            await flowDynamic('Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.');
        }
    });

module.exports = {
    flujoPrincipal,
};

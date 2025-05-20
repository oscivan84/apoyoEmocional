const { addKeyword } = require('@bot-whatsapp/bot');
const { logIncomingMessage } = require('./services/messageLoggerService');

const flujoPrincipal = addKeyword(['hola', 'buenos dias', 'buenas'])
    .addAnswer(
        '👋 ¡Hola! Bienvenido al sistema de registro de mensajes',
        null,
        async (ctx) => {
            try {
                await logIncomingMessage({
                    from: ctx.from,
                    message: ctx.body,
                    flowState: 'inicio'
                });
            } catch (error) {
                console.error('Error registrando mensaje:', error);
            }
        }
    )
    .addAnswer([
        'Tu mensaje será registrado automáticamente.',
        'Puedes enviar cualquier mensaje y se guardará en la base de datos.',
        '',
        'Opciones disponibles:',
        '1. Enviar un mensaje para registrar',
        '2. Ver estado del sistema',
        '3. Finalizar conversación'
    ].join('\n'));

const flujoRegistro = addKeyword(['1', 'registrar', 'mensaje'])
    .addAnswer(
        'Escribe el mensaje que deseas registrar:',
        { capture: true },
        async (ctx) => {
            try {
                await logIncomingMessage({
                    from: ctx.from,
                    message: ctx.body,
                    flowState: 'mensaje_usuario'
                });
                return 'Mensaje registrado exitosamente ✅';
            } catch (error) {
                console.error('Error en registro:', error);
                return 'Hubo un error al registrar el mensaje ❌';
            }
        }
    );

const flujoEstado = addKeyword(['2', 'estado', 'sistema'])
    .addAnswer(
        'Sistema de registro activo y funcionando correctamente ✅',
        null,
        async (ctx) => {
            try {
                await logIncomingMessage({
                    from: ctx.from,
                    message: 'consulta_estado',
                    flowState: 'verificacion_sistema'
                });
            } catch (error) {
                console.error('Error en verificación:', error);
            }
        }
    );

const flujoFin = addKeyword(['3', 'fin', 'terminar', 'finalizar'])
    .addAnswer(
        'Gracias por usar el sistema de registro. ¡Hasta pronto! 👋',
        null,
        async (ctx) => {
            try {
                await logIncomingMessage({
                    from: ctx.from,
                    message: 'fin_conversacion',
                    flowState: 'finalizado'
                });
            } catch (error) {
                console.error('Error en finalización:', error);
            }
        }
    );

module.exports = {
    flujoPrincipal,
    flujoRegistro,
    flujoEstado,
    flujoFin
};

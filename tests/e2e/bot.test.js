// tests/e2e/bot.test.js
const { adapterProvider } = require('../../src/providers/whatsapp');
const messageService = require('../../src/services/messageService');
const notificationService = require('../../src/services/notifications/notificationService');

jest.mock('../../src/providers/whatsapp');
jest.mock('../../src/services/messageService');
jest.mock('../../src/services/notifications/notificationService');

describe('Bot E2E Tests', () => {
    beforeEach(() => {
        // Configurar estado inicial del bot
        adapterProvider.initialize();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Message Flow', () => {
        it('should handle complete message flow', async () => {
            // Simular mensaje entrante
            const incomingMessage = {
                from: '573155935407',
                body: 'Hola'
            };

            // Simular respuesta del bot
            adapterProvider.sendText.mockResolvedValueOnce({ 
                status: 'sent' 
            });

            // Simular guardado en base de datos
            messageService.saveMessage.mockResolvedValueOnce({ 
                id: 1 
            });

            // Ejecutar flujo completo
            await adapterProvider.emit('message', incomingMessage);

            // Verificar que se ejecutaron todas las acciones
            expect(messageService.saveMessage).toHaveBeenCalled();
            expect(adapterProvider.sendText).toHaveBeenCalled();
        });

        it('should handle error in message flow', async () => {
            const incomingMessage = {
                from: '573155935407',
                body: 'Test error'
            };

            // Simular error en el bot
            adapterProvider.sendText.mockRejectedValueOnce(
                new Error('Bot error')
            );

            // Ejecutar flujo
            await adapterProvider.emit('message', incomingMessage);

            // Verificar manejo de error
            expect(notificationService.notify).toHaveBeenCalledWith(
                'whatsapp',
                'systemError',
                expect.any(Object)
            );
        });
    });
});

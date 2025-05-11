// tests/unit/messageService.test.js
const messageService = require('../../src/services/messageService');
const { Pool } = require('pg');

jest.mock('pg', () => ({
    Pool: jest.fn()
}));

describe('Message Service', () => {
    let mockPool;

    beforeEach(() => {
        mockPool = {
            query: jest.fn()
        };
        Pool.mockImplementation(() => mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('saveMessage', () => {
        it('should save message successfully', async () => {
            const message = {
                numeroTelefono: '573155935407',
                mensaje: 'Test message',
                respuesta: 'Test response'
            };

            mockPool.query.mockResolvedValueOnce({ rows: [message] });

            const result = await messageService.saveMessage(
                message.numeroTelefono,
                message.mensaje,
                message.respuesta
            );

            expect(result).toEqual(message);
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should handle errors when saving message', async () => {
            const error = new Error('Database error');
            mockPool.query.mockRejectedValueOnce(error);

            await expect(
                messageService.saveMessage('123', 'test', 'response')
            ).rejects.toThrow('Database error');
        });
    });
});

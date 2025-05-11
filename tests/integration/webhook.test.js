// tests/integration/webhook.test.js
const request = require('supertest');
const express = require('express');
const { router } = require('../../src/webhook');
const messageService = require('../../src/services/messageService');
const notificationService = require('../../src/services/notifications/notificationService');

jest.mock('../../src/services/messageService');
jest.mock('../../src/services/notifications/notificationService');

describe('Webhook Integration', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api', router);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/webhook', () => {
        it('should process valid message', async () => {
            const message = {
                sender: '573155935407',
                message: 'Test message'
            };

            messageService.saveMessage.mockResolvedValueOnce({ id: 1 });

            const response = await request(app)
                .post('/api/webhook')
                .send(message)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(messageService.saveMessage).toHaveBeenCalledWith(
                message.sender,
                message.message,
                expect.any(String)
            );
        });

        it('should handle invalid message format', async () => {
            const response = await request(app)
                .post('/api/webhook')
                .send({})
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(messageService.saveMessage).not.toHaveBeenCalled();
        });

        it('should handle service errors', async () => {
            const message = {
                sender: '573155935407',
                message: 'Test message'
            };

            messageService.saveMessage.mockRejectedValueOnce(
                new Error('Service error')
            );

            const response = await request(app)
                .post('/api/webhook')
                .send(message)
                .expect(500);

            expect(response.body.error).toBeDefined();
            expect(notificationService.notify).toHaveBeenCalled();
        });
    });
});

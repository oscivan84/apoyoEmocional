// tests/setup.js
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno de prueba
dotenv.config({ path: path.join(__dirname, '../.env.test') });

// Mock para Winston logger
jest.mock('../src/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
}));

// Mock para servicios externos
jest.mock('../src/services/notifications/channels', () => ({
    whatsapp: jest.fn(),
    webhook: jest.fn(),
    console: jest.fn()
}));

// Limpiar mocks después de cada prueba
afterEach(() => {
    jest.clearAllMocks();
});

// src/middlewares/messageValidation.js
const logger = require('../utils/logger');

const validateMessage = (req, res, next) => {
    const { body } = req;
    
    // Validar estructura b�sica del mensaje
    if (!body || !body.message || !body.sender) {
        logger.error('Mensaje inv�lido recibido', { body });
        return res.status(400).json({
            error: 'Formato de mensaje inv�lido'
        });
    }

    // Sanitizaci�n b�sica
    body.message = body.message.trim();
    body.sender = body.sender.trim();

    // Validar longitud del mensaje
    if (body.message.length > 4096) {
        logger.warn('Mensaje demasiado largo', {
            sender: body.sender,
            length: body.message.length
        });
        return res.status(400).json({
            error: 'Mensaje demasiado largo'
        });
    }

    next();
};

module.exports = validateMessage;

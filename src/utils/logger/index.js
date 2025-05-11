// src/utils/logger/index.js
const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Asegurar que el directorio de logs existe
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Formato personalizado para los logs
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = ${timestamp} []: ;
    if (Object.keys(metadata).length > 0) {
        msg +=  ;
    }
    return msg;
});

// Crear el logger
const logger = createLogger({
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        // Logs de error
        new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Logs generales
        new transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Logs en consola para desarrollo
        new transports.Console({
            format: combine(
                colorize(),
                customFormat
            ),
        })
    ]
});

// Función para limpiar logs antiguos
const cleanOldLogs = () => {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
    fs.readdir(logDir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const filePath = path.join(logDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) throw err;
                if (Date.now() - stats.mtime.getTime() > maxAge) {
                    fs.unlink(filePath, err => {
                        if (err) throw err;
                        console.log(Archivo de log antiguo eliminado: );
                    });
                }
            });
        });
    });
};

// Programar limpieza diaria de logs
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000);

module.exports = logger;

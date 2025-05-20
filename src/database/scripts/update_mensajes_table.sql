-- Actualizar la tabla mensajes_entrantes para soportar tipos de mensaje
ALTER TABLE mensajes_entrantes
ADD COLUMN IF NOT EXISTS tipo_mensaje VARCHAR(50) DEFAULT 'text';

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_mensajes_tipo ON mensajes_entrantes(tipo_mensaje);

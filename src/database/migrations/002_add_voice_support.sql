-- Migración para agregar soporte de mensajes de voz
ALTER TABLE interacciones 
ADD COLUMN IF NOT EXISTS transcripcion TEXT,
ADD COLUMN IF NOT EXISTS archivo_audio TEXT,
ADD COLUMN IF NOT EXISTS duracion_audio INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tipo_mensaje VARCHAR(20) DEFAULT 'text';

-- Crear índice para búsquedas por tipo de mensaje
CREATE INDEX IF NOT EXISTS idx_interacciones_tipo_mensaje ON interacciones(tipo_mensaje);

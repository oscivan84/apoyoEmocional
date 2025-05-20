-- Modificación de la tabla interacciones
ALTER TABLE interacciones
ADD COLUMN IF NOT EXISTS estado_flujo TEXT,
ADD COLUMN IF NOT EXISTS id_sesion VARCHAR(100),
ADD COLUMN IF NOT EXISTS tipo_mensaje VARCHAR(20) DEFAULT 'text';
-- src/database/migrations/001_initial_schema.sql
BEGIN;

-- Tabla de mensajes con índices optimizados
CREATE TABLE IF NOT EXISTS mensajes (
    id SERIAL PRIMARY KEY,
    telefono VARCHAR(20) NOT NULL,
    mensaje TEXT NOT NULL,
    respuesta TEXT,
    estado_flujo VARCHAR(50),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_mensajes_telefono ON mensajes(telefono);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha_creacion ON mensajes(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_mensajes_estado_flujo ON mensajes(estado_flujo);

-- Tabla de caché de respuestas frecuentes
CREATE TABLE IF NOT EXISTS respuestas_cache (
    id SERIAL PRIMARY KEY,
    patron_mensaje TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    contador_uso INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS ⏭️ Continúe con la Parte 4: Optimización de Base de Datos
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
⏭️ Continúe con la Parte 4: Optimización de Base de Datos LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion
CREATE TRIGGER tr_mensajes_update_timestamp
    BEFORE UPDATE ON mensajes
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- Función para limpiar mensajes antiguos
CREATE OR REPLACE FUNCTION limpiar_mensajes_antiguos(dias INTEGER)
RETURNS INTEGER AS ⏭️ Continúe con la Parte 4: Optimización de Base de Datos
DECLARE
    registros_eliminados INTEGER;
BEGIN
    DELETE FROM mensajes
    WHERE fecha_creacion < CURRENT_TIMESTAMP - (dias || ' days')::INTERVAL;
    GET DIAGNOSTICS registros_eliminados = ROW_COUNT;
    RETURN registros_eliminados;
END;
⏭️ Continúe con la Parte 4: Optimización de Base de Datos LANGUAGE plpgsql;

COMMIT;

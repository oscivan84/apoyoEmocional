-- Tabla para almacenar mensajes entrantes
CREATE TABLE IF NOT EXISTS mensajes_entrantes (
  id SERIAL PRIMARY KEY,
  telefono VARCHAR(20),
  mensaje TEXT,
  estado_flujo TEXT,
  id_sesion VARCHAR(100),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_mensajes_telefono ON mensajes_entrantes(telefono);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes_entrantes(fecha);
CREATE INDEX IF NOT EXISTS idx_mensajes_estado_flujo ON mensajes_entrantes(estado_flujo);

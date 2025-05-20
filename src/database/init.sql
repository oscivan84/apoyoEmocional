CREATE TABLE IF NOT EXISTS mensajes_entrantes (
    id SERIAL PRIMARY KEY,
    telefono VARCHAR(20) NOT NULL,
    mensaje TEXT NOT NULL,
    estado_flujo TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

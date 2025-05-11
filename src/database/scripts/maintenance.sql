-- src/database/scripts/maintenance.sql
-- Actualizar estadísticas
ANALYZE mensajes;
ANALYZE respuestas_cache;

-- Vaciar registros antiguos
SELECT limpiar_mensajes_antiguos(30);

-- Actualizar índices
REINDEX TABLE mensajes;
REINDEX TABLE respuestas_cache;

-- Vaciar caché antigua
DELETE FROM respuestas_cache
WHERE ultima_actualizacion < CURRENT_TIMESTAMP - INTERVAL '7 days'
AND contador_uso < 10;

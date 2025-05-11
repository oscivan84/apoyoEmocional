Objetivo:
Registrar automáticamente cada mensaje entrante del usuario en la base de datos PostgreSQL con información útil como:

número de teléfono

mensaje recibido

fecha/hora

ID de sesión

estado actual del flujo (si aplica)

📂 Estructura propuesta
Agrega este nuevo archivo dentro de src/services/:

css
Copiar
Editar
src/
  services/
    messageLoggerService.js  <-- Nuevo
🧠 Paso 1: Crear el servicio messageLoggerService.js
js
Copiar
Editar
// src/services/messageLoggerService.js
const { Pool } = require('pg');
const dbConfig = require('../config/db'); // Tu configuración DB centralizada

const pool = new Pool(dbConfig);

async function logIncomingMessage({ from, message, flowState }) {
  try {
    await pool.query(
      `INSERT INTO mensajes_entrantes (telefono, mensaje, estado_flujo, fecha) VALUES ($1, $2, $3, NOW())`,
      [from, message, flowState || null]
    );
  } catch (error) {
    console.error('Error al guardar el mensaje en PostgreSQL:', error);
  }
}

module.exports = {
  logIncomingMessage,
};
Asegúrate de que exista la tabla mensajes_entrantes en PostgreSQL:

sql
Copiar
Editar
CREATE TABLE IF NOT EXISTS mensajes_entrantes (
  id SERIAL PRIMARY KEY,
  telefono VARCHAR(20),
  mensaje TEXT,
  estado_flujo TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
⚙️ Paso 2: Invocar el logger desde flows.js
Abre tu archivo flows.js y en el bloque principal donde capturas mensajes entrantes, agrega el logger.

js
Copiar
Editar
const { logIncomingMessage } = require('./src/services/messageLoggerService');

// Dentro de tu flujo principal o función que procesa los mensajes:
const flujoPrincipal = addKeyword(['hola', 'buenas', 'info'])
  .addAction(async (ctx, { flowDynamic, state }) => {
    const userPhone = ctx.from;
    const message = ctx.body;
    const currentState = await state.get('current') || 'inicio';

    // Guardar mensaje entrante
    await logIncomingMessage({
      from: userPhone,
      message,
      flowState: currentState,
    });

    await flowDynamic('¡Hola! ¿En qué te puedo ayudar hoy? 😊');
  });
Esto funciona bien incluso si tienes varios flujos divididos. Puedes invocar logIncomingMessage en cada punto de entrada o usar un wrapper.
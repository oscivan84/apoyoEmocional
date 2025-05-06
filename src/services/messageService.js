// src/services/messageService.js
const { client } = require('../config/database');

const saveMessage = async (numeroTelefono, mensaje, respuesta) => {
  try {
    const query = `
      INSERT INTO interacciones (numero_telefono, mensaje, respuesta)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [numeroTelefono, mensaje, respuesta];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    throw error;
  }
};

const markMessageAsSent = async (id) => {
  try {
    const query = `
      UPDATE interacciones
      SET enviado = true
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al marcar mensaje como enviado:', error);
    throw error;
  }
};

module.exports = {
  saveMessage,
  markMessageAsSent
};

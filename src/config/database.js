// src/config/database.js
const { Client } = require('pg');

const dbConfig = {
  user: 'admin',
  host: 'localhost',
  database: 'botwsp1.3',
  password: 'portIvan*.2015ñ',
  port: 5432
};

const client = new Client(dbConfig);

// Conectar al iniciar la aplicación
const connectDB = async () => {
  try {
    await client.connect();
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { client, connectDB };

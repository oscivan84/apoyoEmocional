# Bot de WhatsApp - Documentación

## 📚 Índice

1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Uso](#uso)
5. [API](#api)
6. [Guías](#guías)
7. [Ejemplos](#ejemplos)
8. [Mantenimiento](#mantenimiento)

## 🚀 Introducción

Este bot de WhatsApp está construido utilizando:
- @bot-whatsapp/bot
- Express.js
- PostgreSQL
- Sistema de caché
- Monitoreo en tiempo real
- Sistema de respaldo automático
- Notificaciones multicanal

## ⚙️ Instalación

\\\ash
# Clonar el repositorio
git clone [URL_REPOSITORIO]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar el bot
npm start
\\\

## 🔧 Configuración

### Variables de Entorno
\\\env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=portIvan*.2015
DB_NAME=botwsp13

# Configuración del bot
BOT_NUMBER=573155935407
BOT_NAME=MiBot

# Configuración de respaldos
BACKUP_RETENTION_DAYS=7
\\\

## 💻 Uso

### Comandos Principales
\\\ash
# Iniciar el bot
npm start

# Ejecutar respaldo manual
npm run backup

# Ejecutar mantenimiento de BD
npm run db:maintenance
\\\

## 🔄 Mantenimiento

### Respaldos Automáticos
- Base de datos: Diario a las 3 AM
- Sesiones: Cada 6 horas
- Logs: Diario

### Monitoreo
- Endpoint: /api/monitoring/metrics
- Dashboard: /api/monitoring/dashboard

### Logs
- Ubicación: ./logs/
- Rotación: Diaria
- Retención: 7 días

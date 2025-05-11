# API Documentation

## 📡 Endpoints

### Webhook
\POST /api/webhook\

Recibe mensajes de WhatsApp y los procesa.

#### Request
\\\json
{
  "sender": "string",
  "message": "string"
}
\\\

#### Response
\\\json
{
  "success": true,
  "message": "string"
}
\\\

### Monitoring
\GET /api/monitoring/metrics\

Obtiene métricas del sistema.

#### Response
\\\json
{
  "messages": {
    "total": "number",
    "success": "number",
    "failed": "number"
  },
  "performance": {
    "responseTime": "number",
    "uptime": "number"
  }
}
\\\

## 🔒 Seguridad

### Rate Limiting
- 100 requests por 15 minutos por IP
- Headers requeridos:
  - Content-Type: application/json
  - Authorization: Bearer token

### Validación
- Tamaño máximo de mensaje: 4096 caracteres
- Formato de número: E.164

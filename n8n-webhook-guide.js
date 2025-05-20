// Este script puede ser importado en n8n para simular los webhooks anteriores

// Ejemplo de flujo en n8n:
// 1. Trigger (HTTP Request, Webhook, etc.)
// 2. Procesar datos
// 3. Enviar respuesta a WhatsApp usando la API de WhatsApp directamente

// Ejemplo de configuración para enviar mensajes a WhatsApp:
// - Usar el nodo "HTTP Request" en n8n
// - Método: POST
// - URL: https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages
// - Headers: Authorization: Bearer YOUR_ACCESS_TOKEN
//           Content-Type: application/json
// - Body: 
/*
{
  "messaging_product": "whatsapp",
  "to": "{{$node["Trigger"].json["phone"]}}",
  "type": "text",
  "text": {
    "body": "{{$node["Trigger"].json["message"]}}"
  }
}
*/

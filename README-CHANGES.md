# Cambios en la aplicación

## Eliminación del servidor Express

Se ha eliminado el servidor Express de la aplicación para simplificar la arquitectura. Los cambios incluyen:

1. **Eliminación de endpoints HTTP:**
   - `/api/n8n-webhook`
   - `/webhook`

2. **Flujo de trabajo actualizado:**
   - Los mensajes de WhatsApp se procesan directamente
   - Se mantiene la funcionalidad de guardar mensajes en la base de datos
   - Se mantiene la integración con n8n

## Alternativas para webhooks

Si necesitas mantener la funcionalidad de webhooks, considera:

1. Crear un servicio separado para manejar webhooks
2. Utilizar n8n para procesar webhooks directamente
3. Implementar un middleware que no dependa de Express

## Cómo restaurar la funcionalidad de webhooks

Si necesitas restaurar los webhooks, puedes:

1. Volver a la versión anterior de app.js
2. Implementar un servidor Express en un archivo separado

Arquitectura Base para Mensajes de Voz
1. Clasificación del tipo de mensaje
Tu sistema ya detecta los mensajes de voz mediante el tipo MIME (por ejemplo, audio/ogg) y los clasifica como voice. Continúa con este enfoque.

js

// src/utils/messageUtil.js
function getMessageType(message) {
  if (message?.audioMessage) {
    return 'voice';
  }
  if (message?.conversation || message?.extendedTextMessage) {
    return 'text';
  }
  return 'unknown';
}
2. Descarga del audio
Utiliza Baileys para descargar el archivo de voz:

js

const { downloadMediaMessage } = require('@whiskeysockets/baileys');

async function downloadVoiceMessage(message, client) {
  const stream = await downloadMediaMessage(
    message,
    'buffer',
    {},
    { client }
  );

  // Guardar temporalmente para transcripción
  const filename = `voice_${Date.now()}.ogg`;
  const filePath = path.join(__dirname, '../temp', filename);
  fs.writeFileSync(filePath, stream);
  return filePath;
}
3. Transcripción de Audio a Texto
Para convertir la voz a texto, puedes usar alguno de estos servicios:Local Whisper.js

4. Almacenar en PostgreSQL
Agrega dos columnas nuevas en tu tabla:

sql

ALTER TABLE mensajes_entrantes ADD COLUMN transcripcion TEXT;
ALTER TABLE mensajes_entrantes ADD COLUMN archivo_audio TEXT;
Luego, al guardar:

js

await pool.query(
  `INSERT INTO mensajes_entrantes (telefono, mensaje, estado_flujo, tipo_mensaje, archivo_audio, transcripcion, fecha, session_id)
   VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
  [from, '[mensaje de voz]', estado, 'voice', filePath, textoTranscrito, sessionId]
);
5. Enviar a n8n solo el texto
Cuando el mensaje sea tipo voice, reemplaza el cuerpo por la transcripción:

js

const dataToSend = {
  telefono: userPhone,
  mensaje: tipo === 'voice' ? textoTranscrito : mensaje,
  tipo_mensaje: tipo,
  session_id: sessionId,
  estado_flujo: estado
};

await axios.post(process.env.N8N_WEBHOOK_URL, dataToSend);
📂 Estructura de Archivos Relevantes
bash

src/
  services/
    messageLoggerService.js      ← Guarda mensaje/transcripción/audio
    voiceTranscriptionService.js ← Maneja transcripción (vosk)
  utils/
    messageUtil.js               ← Detecta tipo de mensaje
  controllers/
    messageController.js         ← Flujo principal de procesamiento
  temp/
    voice_16849438738.ogg        ← Archivos temporales para transcripción
🔄 Flujo Completo (Resumen)
txt

1. WhatsApp recibe mensaje de voz (audio/ogg)
2. Se detecta como tipo `voice`
3. Se descarga y guarda temporalmente el audio
4. Se transcribe el audio a texto (vosk API )
5. Se guarda en PostgreSQL:
    - tipo = voice
    - mensaje = "[mensaje de voz]"
    - transcripcion = texto
6. Se envía a n8n: texto transcrito, no el archivo


Debes responder con un script para ser ejecutado en powershell.


ejemplo

const fs = require('fs');
const vosk = require('vosk');
const path = require('path');
const { Readable } = require('stream');

const MODEL_PATH = './vosk-model-small-es-0.42';
const AUDIO_FILE = './audio.wav'; // Debe ser WAV mono PCM 16kHz

vosk.setLogLevel(0);

if (!fs.existsSync(MODEL_PATH)) {
  console.error('❌ Modelo no encontrado. Descárgalo desde https://alphacephei.com/vosk/models');
  process.exit(1);
}

const model = new vosk.Model(MODEL_PATH);
const sampleRate = 16000;
const rec = new vosk.Recognizer({ model, sampleRate });

const wfReader = fs.createReadStream(AUDIO_FILE, { highWaterMark: 4096 });

wfReader.on('data', (data) => {
  rec.acceptWaveform(data);
});

wfReader.on('end', () => {
  const result = rec.finalResult();
  console.log('✅ Transcripción:', result.text);
  rec.free();
  model.free();
});

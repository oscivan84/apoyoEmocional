

const { addKeyword, addAnswer } = require('@bot-whatsapp/bot');
const path = require('path');

// Ruta del video que se mostrará
const pathLocalVideo = path.join(__dirname, 'img', 'video', 'apredaNadar.mp4');

/*const flowRegistro = addKeyword(['7']) // Flujo que se activa cuando selecciona la opción 7
  .addAnswer(
    '📝 ¡Genial! 🚀\n\n✍️ Para inscribirte, necesitamos algunos datos. Primero, ¿cuál es tu *nombre completo*? 😊 \n8. Regresar. 🔙',
    { capture: true },
    async (ctx, { flowDynamic }) => {
        const nombre = ctx.body.trim();
        console.log("Nombre del usuario: " + nombre);
        await flowDynamic([
            { body: '📧 Ahora, por favor, indícanos tu correo electrónico.' }
        ]);
    }
  )
este esta uncionando OK........
const flowRegistroCorreo=addKeyword(['7'])
.addAnswer('📝 ¡Genial! 🚀\n\n✍️  ¿cuál es tu *correo electroniico*? 😊 \n8. Regresar. 🔙',
{capture:true},(ctx,{fallBack}
)=>{console.log("el largo es:"+ctx.body.length);
if(ctx.body.length<=6){
  return fallBack()
}
  }
  )
const flowRegistro=addKeyword(['7'])
.addAnswer('📝 ¡Genial! 🚀\n\n✍️ Para inscribirte, necesitamos algunos datos. Primero, ¿cuál es tu *nombre completo*? 😊 \n*8* Regresar. 🔙',
{capture:true},(ctx,{fallBack}
)=>{console.log("el largo es:"+ctx.body.length);
if(ctx.body.length<=6){
  return fallBack()
}
  },
  [flowRegistroCorreo]
  )
   */

const flowRegistroCorreo = addKeyword(['']) // Define un identificador único para este flujo
  .addAnswer(
    'Genial!✍️ ',
    { capture: true },
    (ctx, { fallBack }) => {
      console.log("El largo es: " + ctx.body.length);
      if (ctx.body.length <= 6) {
        return fallBack();
      }
    }
  );
var correo="";
  const flowRegistro = addKeyword(['7']) // Define un identificador único para este flujo
  .addAnswer(
    '📝 ¡Genial!',
    { capture: true },
    (ctx, { fallBack }) => {
      console.log("El largo es: " + ctx.body.length);

      if (ctx.body.length >= 6 &correo.length<1) {
        console.log(correo)
        correo=ctx.body;
        return fallBack('📧');
        
      }
      else if(ctx.body.length < 6){
        return fallBack('🚀');
      }
      // Aquí podrías guardar el nombre si es necesario
    }
  )
  .addAnswer(
    '📝 ',
    { capture: true },
    (ctx, { fallBack }) => {
      // Puedes añadir una validación básica para el formato del correo aquí
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ctx.body)) {
        return fallBack('Parece que el correo electrónico no es válido. Por favor, inténtalo de nuevo.');
      }
      // Aquí podrías guardar el correo si es necesario
      console.log('Correo electrónico capturado:', ctx.body);
    }
  );




const flowGeneral = addKeyword('8').addAnswer('*1* 🏊🏼‍♀️',
  { capture: true }, (ctx, { fallBack }
  ) => {
  const validOptions = ['1', '2', '3', '4'];
  if (!validOptions.includes(ctx.body.trim())) {
    return fallBack();
  }
}, [flowRegistro])

const flowCurso2 = addKeyword('2').addAnswer('press 2', 
null, null
  , [flowRegistro])

const verCursosRegreso = addKeyword('9')
  .addAnswer(
    '🧓👵',
    
    { capture: true }, (ctx, { fallBack }
    ) => {
    const validOptions = ['7', '9'];
    if (!validOptions.includes(ctx.body.trim())) {
      return fallBack();  
    }
    [flowRegistro,verCursos]
  },

    [

      addKeyword('1').addAnswer('🏊‍♀️ *N',
        { capture: true }, (ctx, { fallBack }
        ) => {
        const validOptions = ['9', '7'];
        if (!validOptions.includes(ctx.body.trim())) {
          return fallBack();
        }
      },
        [flowRegistro]),
      addKeyword('2').addAnswer(' 💻 🔙',
        { capture: true }, (ctx, { fallBack }
        ) => {
        const validOptions = ['9', '7'];
        if (!validOptions.includes(ctx.body.trim())) {
          return fallBack();
        }
      },
        [flowRegistro]),
      addKeyword('3').addAnswer(' 🏖️',
        { capture: true }, (ctx, { fallBack }
        ) => {
        const validOptions = ['9', '7'];
        if (!validOptions.includes(ctx.body.trim())) {
          return fallBack();
        }
      },
        [flowRegistro]),
      //addKeyword('7').addAnswer('Iniciando proceso de inscripción...', null, null, [flowRegistro]),

    ]
  );

const verCursos = addKeyword('1')
  .addAnswer(
    '🏅 1',
    { capture: true }, (ctx, { fallBack }
    ) => {
    const validOptions = ['1', '2', '3'];
    if (!validOptions.includes(ctx.body.trim())) {
      return fallBack();
    }
  },
    [

      addKeyword('1')
        .addAnswer('🏊‍♀️ ',
          { capture: true }, (ctx, { fallBack }
          ) => {
          const validOptions = ['7', '9'];
          if (!validOptions.includes(ctx.body.trim())) {
            return fallBack();
          }
        },
          [verCursosRegreso, flowRegistro]),
      addKeyword('2').addAnswer('🏊‍♀️ ',
        { capture: true }, (ctx, { fallBack }
        ) => {
        const validOptions = ['7', '9'];
        console.log(verCursos)
        if (!validOptions.includes(ctx.body.trim())) {
          return fallBack();
        }
      },
        [verCursosRegreso, flowRegistro]),

      addKeyword('3').addAnswer('🏊‍♂️ ',
        { capture: true }, (ctx, { fallBack }
        ) => {
        const validOptions = ['7', '9'];
        if (!validOptions.includes(ctx.body.trim())) {
          return fallBack();
        }
      },
        [verCursosRegreso, flowRegistro]),

      //addKeyword('7').addAnswer('Iniciando proceso de inscripción...', [flowRegistro]),
      //addKeyword('9').addAnswer('Iniciando proceso de inscripción...', null, null, [verCursosRegreso]),

    ]
  );

const segundoá = addKeyword("gracias")
  .addAnswer('Seleccione ',
    {
      capture: true
    }, (ctx) => {
      // Convertimos la respuesta a string y eliminamos posibles espacios
      const respuesta = ctx.body.trim();
      console.log("Respuesta capturada: " + respuesta);
      console.log('Contenido de ctx:', JSON.stringify(ctx, null, 2));
      console.log('Contenido de ctx.body:', JSON.stringify(ctx.verifiedBizName, null, 2));

      // Verificar las opciones ingresadas
      if (respuesta === '4') {
        return addAnswer("Has seleccionado la opción 4.");
      }

      // Si la opción no es válida
      return addAnswer("Lo siento, la opción ingresada no es válida. Por favor selecciona una opción válida.");
    }
  );
// Flujo principal
const flowPrincipal = addKeyword([
  'hola', 'Hola', 'ole', 'Oli', 'holi', 'Holi', '¿Cómo estás?', 'cómo estás',
  'que haces', 'qué haces', 'buenas', 'buenos días', 'buen día', 'hello',
  'hi', 'qué tal', 'saludos', 'holis', 'buenas tardes', 'buenas noches'
])
  .addAnswer('👋 ¡Hola! ¡Bienvenido! ')
  .addAnswer('👋', {
    //media: pathLocalVideo
  })
  // .addAnswer('Por favor elige una opción:\n\n Escribe 11️⃣ para Ver Cursos 📚', { capture: true }, null, [flowVerCursos]);

  .addAnswer('Conocenos mas:\n\n Escribe 1️ para Ver Cursos 📚',
    { capture: true }, (ctx, { fallBack }
    ) => {
    const validOptions = ['1'];
    if (!validOptions.includes(ctx.body.trim())) {
      return fallBack();
    }
  }
    , [verCursos, flowGeneral]);

// Exportar los flujos
module.exports = { flowPrincipal, segundo: verCursos, flowRegistro };


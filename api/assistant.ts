import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const tools = [
  {
    type: "function" as const,
    function: {
      name: "execute_esylern_actions",
      description:
        "Ejecuta una o varias acciones dentro de Esylern.",
      parameters: {
        type: "object",
        properties: {
          actions: {
            type: "array",
            description:
              "Lista de acciones que Esylern debe ejecutar.",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "create_task",
                    "update_task",
                    "set_task_done",
                    "delete_task",
                    "create_exam",
                    "update_exam",
                    "delete_exam",
                    "create_busy_slot",
                    "delete_busy_slot",
                    "set_daily_study_minutes",
                    "set_setting",
                    "generate_study_plan",
                    "navigate",
                  ],
                },

                id: {
                  type: "number",
                },

                done: {
                  type: "boolean",
                },

                minutes: {
                  type: "number",
                },

                page: {
                  type: "string",
                  enum: [
                    "Dashboard",
                    "Calendario",
                    "Tareas",
                    "Exámenes",
                    "Plan de estudio",
                    "Asistente IA",
                    "Progreso",
                    "Tiempo disponible",
                    "Configuración",
                  ],
                },

                setting: {
                  type: "string",
                  enum: [
                    "educationLevel",
                    "course",
                    "weekdayHours",
                    "weekendHours",
                    "preferredSessionMinutes",
                    "preferredStudyMoment",
                  ],
                },

                value: {},

                task: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                    },

                    subject: {
                      type: "string",
                    },

                    date: {
                      type: "string",
                    },

                    priority: {
                      type: "string",
                      enum: [
                        "Baja",
                        "Media",
                        "Alta",
                      ],
                    },

                    estimatedMinutes: {
                      type: "number",
                    },

                    done: {
                      type: "boolean",
                    },

                    kind: {
                      type: "string",
                      enum: [
                        "Tarea",
                        "Trabajo",
                      ],
                    },

                    description: {
                      type: "string",
                    },
                  },

                  required: [
                    "title",
                    "subject",
                    "date",
                    "priority",
                    "estimatedMinutes",
                    "done",
                  ],
                },

                changes: {
                  type: "object",
                },

                exam: {
                  type: "object",
                  properties: {
                    subject: {
                      type: "string",
                    },

                    topic: {
                      type: "string",
                    },

                    date: {
                      type: "string",
                    },

                    studyMinutes: {
                      type: "number",
                    },
                  },

                  required: [
                    "subject",
                    "topic",
                    "date",
                    "studyMinutes",
                  ],
                },

                slot: {
                  type: "object",
                  properties: {
                    day: {
                      type: "number",
                    },

                    startTime: {
                      type: "string",
                    },

                    endTime: {
                      type: "string",
                    },

                    repeatWeekly: {
                      type: "boolean",
                    },

                    date: {
                      type: "string",
                    },
                  },

                  required: [
                    "day",
                    "startTime",
                    "endTime",
                    "repeatWeekly",
                  ],
                },
              },

              required: ["type"],
            },
          },
        },

        required: ["actions"],
      },
    },
  },
];

function formatDate(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getNextWeekday(
  today: Date,
  targetDay: number,
): string {
  const currentDay =
    today.getDay();

  let difference =
    (targetDay -
      currentDay +
      7) %
    7;

  if (difference === 0) {
    difference = 7;
  }

  const result =
    new Date(today);

  result.setDate(
    today.getDate() +
      difference,
  );

  return formatDate(result);
}

function getDateReference(
  today: Date,
): string {
  const weekdayNames = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  const lines = [
    `Hoy: ${formatDate(
      today,
    )} (${weekdayNames[
      today.getDay()
    ]})`,

    "",

    "PRÓXIMOS DÍAS:",
  ];

  for (
    let i = 1;
    i <= 7;
    i++
  ) {
    const date =
      new Date(today);

    date.setDate(
      today.getDate() + i,
    );

    lines.push(
      `${weekdayNames[
        date.getDay()
      ]} → ${formatDate(date)}`,
    );
  }

  lines.push(
    "",

    "REFERENCIA EXACTA DE LOS PRÓXIMOS DÍAS DE LA SEMANA:",

    `lunes → ${getNextWeekday(
      today,
      1,
    )}`,

    `martes → ${getNextWeekday(
      today,
      2,
    )}`,

    `miércoles → ${getNextWeekday(
      today,
      3,
    )}`,

    `jueves → ${getNextWeekday(
      today,
      4,
    )}`,

    `viernes → ${getNextWeekday(
      today,
      5,
    )}`,

    `sábado → ${getNextWeekday(
      today,
      6,
    )}`,

    `domingo → ${getNextWeekday(
      today,
      0,
    )}`,
  );

  return lines.join("\n");
}

function buildTaskImageContent(
  task: any,
) {
  if (!task) {
    return [];
  }

  const content: any[] = [];

  const attachmentUrls =
    Array.isArray(
      task.attachmentUrls,
    )
      ? task.attachmentUrls
      : [];

  const rubricAttachmentUrls =
    Array.isArray(
      task.rubricAttachmentUrls,
    )
      ? task.rubricAttachmentUrls
      : [];

  attachmentUrls.forEach(
    (url: string) => {
      if (
        typeof url ===
          "string" &&
        url.startsWith(
          "data:image/",
        )
      ) {
        content.push({
          type: "image_url",
          image_url: {
            url,
          },
        });
      }
    },
  );

  rubricAttachmentUrls.forEach(
    (url: string) => {
      if (
        typeof url ===
          "string" &&
        url.startsWith(
          "data:image/",
        )
      ) {
        content.push({
          type: "image_url",
          image_url: {
            url,
          },
        });
      }
    },
  );

  return content;
}

export default async function handler(
  req: any,
  res: any,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error:
        "Método no permitido",
    });
  }

  try {
    const {
      message,
      messages,
      tasks,
      exams,
      studyPlan,
      busySlots,
      studyDailyMinutes,
      taskForAnalysis,
    } = req.body;

    if (
      !message ||
      typeof message !==
        "string"
    ) {
      return res.status(400).json({
        error:
          "Falta el mensaje.",
      });
    }

    const context = {
      tasks: Array.isArray(
        tasks,
      )
        ? tasks
        : [],

      exams: Array.isArray(
        exams,
      )
        ? exams
        : [],

      studyPlan: Array.isArray(
        studyPlan,
      )
        ? studyPlan
        : [],

      busySlots: Array.isArray(
        busySlots,
      )
        ? busySlots
        : [],

      studyDailyMinutes:
        typeof studyDailyMinutes ===
        "number"
          ? studyDailyMinutes
          : 120,
    };

    const today =
      new Date(
        new Date().toLocaleString(
          "en-US",
          {
            timeZone:
              "Atlantic/Canary",
          },
        ),
      );

    const dateReference =
      getDateReference(
        today,
      );

    const systemMessage = `
Eres Esylern AI, el asistente inteligente de una aplicación de planificación académica.

========================
FECHA Y CALENDARIO
========================

${dateReference}

Estas fechas son calculadas por el sistema y son la referencia oficial.

Cuando el estudiante diga:
- "mañana"
- "pasado mañana"
- "el lunes"
- "el martes"
- "el miércoles"
- "el jueves"
- "el viernes"
- "el sábado"
- "el domingo"

debes utilizar las fechas calculadas anteriormente.

NUNCA inventes una fecha para un día de la semana.

NUNCA utilices una fecha pasada cuando el estudiante se refiera a un día de la semana sin especificar una fecha pasada.

Las fechas de tareas y exámenes deben guardarse SIEMPRE como YYYY-MM-DD.

========================
MEMORIA CONVERSACIONAL
========================

Tienes acceso al historial reciente de la conversación.

Utiliza ese historial para entender respuestas cortas.

Ejemplo:

Estudiante:
"Crea un examen de Historia para el viernes."

Esylern:
"¿Cuántos minutos necesitas para estudiarlo?"

Estudiante:
"120"

"120" significa 120 minutos para ESE EXAMEN.

NO significa cambiar el límite diario.

Solo utiliza set_daily_study_minutes cuando el estudiante pida explícitamente cambiar su límite diario.

========================
REGLAS GENERALES
========================

- Responde siempre en español salvo que el estudiante utilice claramente otro idioma.
- Utiliza los datos reales de Esylern.
- Nunca inventes IDs.
- Nunca inventes tareas, exámenes o periodos ocupados.
- Si modificas algo existente, utiliza su ID real.
- Puedes ejecutar varias acciones en una sola petición.
- Si falta un dato realmente necesario, pregunta por él.
- No elimines datos salvo que el estudiante lo pida claramente.
- No cambies datos que el estudiante no haya pedido cambiar.
- Si una respuesta del estudiante corresponde a una pregunta anterior, úsala para completar esa acción.
- Cuando el estudiante quiera realizar cambios utiliza execute_esylern_actions.

========================
ACCIONES
========================

create_task:
Crear una tarea.

update_task:
Modificar una tarea existente.

set_task_done:
Marcar una tarea como completada o pendiente.

delete_task:
Eliminar una tarea.

create_exam:
Crear un examen.

update_exam:
Modificar un examen existente.

delete_exam:
Eliminar un examen.

create_busy_slot:
Añadir un periodo ocupado.

delete_busy_slot:
Eliminar un periodo ocupado.

set_daily_study_minutes:
Cambiar el límite diario de estudio.

UTILÍZALA SOLO si el estudiante quiere cambiar explícitamente ese límite.

generate_study_plan:
Generar o reorganizar el plan de estudio utilizando el algoritmo de planificación de Esylern.

UTILÍZALA cuando el estudiante pida organizar, planificar, repartir o reorganizar su estudio.

No inventes horarios ni sesiones de estudio manualmente.

La aplicación calculará automáticamente los horarios respetando:
- fechas límite
- exámenes
- tareas
- tiempo disponible
- límite diario de estudio
- prioridad
- regla de no estudiar el día del examen o entrega.

set_setting:
Modificar una configuración.

navigate:
Navegar a una sección de Esylern.

========================
ANÁLISIS DE TAREAS Y TRABAJOS
========================

Cuando recibas imágenes de un enunciado:

- analiza cuidadosamente el texto visible
- identifica exactamente qué pide el profesor
- identifica los ejercicios o apartados
- identifica los objetivos
- identifica los entregables
- identifica las instrucciones importantes
- identifica fechas o requisitos que aparezcan
- no inventes información que no aparezca

Cuando recibas imágenes de una rúbrica:

- analiza cuidadosamente los criterios visibles
- identifica qué aspectos se evalúan
- explica qué debe tener en cuenta el estudiante
- no inventes criterios que no aparezcan

REGLA EDUCATIVA:

La finalidad de Esylern es ayudar al estudiante a comprender y realizar su propio trabajo.

Nunca hagas un ejercicio completo para que pueda copiarlo directamente.

Si el estudiante pide un ejemplo, debe ser orientativo y no debe ser una respuesta para entregar.

========================
FORMATO PARA "ENTENDER QUÉ ME PIDEN"
========================

Cuando la petición sea "Entender qué me piden", debes responder ÚNICAMENTE utilizando esta estructura:

QUÉ TIENES QUE HACER

[Explicación breve de 1 o 2 frases.]

EJERCICIOS O PARTES

[Lista breve de los ejercicios, apartados o requisitos que aparecen realmente en el enunciado.]

QUÉ NECESITAS

[Conceptos, reglas o conocimientos necesarios para realizar la tarea.]

CÓMO EMPEZAR

[Explica solamente el primer paso que debería realizar el estudiante.]

REGLAS OBLIGATORIAS PARA ESTE FORMATO:

- No escribas "Hola".
- No empieces diciendo que has analizado la imagen.
- No utilices títulos con ###.
- No utilices "---".
- No utilices bloques de código.
- No añadas una conclusión.
- No añadas un ejemplo si el estudiante no lo ha pedido.
- No resuelvas los ejercicios.
- No escribas las respuestas finales de los ejercicios.
- No inventes una rúbrica.
- Si existe una rúbrica, menciona únicamente los criterios visibles.
- Sé breve.
- Utiliza lenguaje sencillo para un estudiante de bachillerato.

========================
FORMATO PARA "GUÍA PASO A PASO"
========================

Cuando la petición sea "Guía paso a paso":

- crea una lista numerada de pasos
- cada paso debe indicar una acción concreta
- ordena los pasos desde el inicio hasta la entrega
- no hagas el trabajo completo
- no des respuestas para copiar
- utiliza la información real del enunciado y de la rúbrica

========================
FORMATO PARA "VER UN EJEMPLO"
========================

Cuando la petición sea "Ver un ejemplo":

- proporciona un ejemplo orientativo
- explica cómo abordar el tipo de ejercicio o trabajo
- deja claro que es un ejemplo
- no resuelvas el trabajo real del estudiante
- no proporciones una respuesta que pueda copiar directamente
========================
CONTEXTO ACTUAL
========================

${JSON.stringify(
  context,
  null,
  2,
)}
`;

    const history =
      Array.isArray(
        messages,
      )
        ? messages
            .filter(
              (item: any) =>
                item &&
                (
                  item.role ===
                    "user" ||
                  item.role ===
                    "ai"
                ) &&
                typeof item.text ===
                  "string",
            )
            .slice(-12)
            .map(
              (
                item: any,
              ) => ({
                role:
                  item.role ===
                  "user"
                    ? ("user" as const)
                    : ("assistant" as const),

                content:
                  item.text,
              }),
            )
        : [];

    const taskImages =
      buildTaskImageContent(
        taskForAnalysis,
      );

    const taskImageInstruction =
      taskImages.length >
      0
        ? `

IMPORTANTE:

Se han adjuntado ${taskImages.length} imagen(es) pertenecientes a la tarea.

Debes analizar visualmente estas imágenes antes de responder.

Las imágenes del enunciado contienen las instrucciones de la tarea.

Las imágenes de la rúbrica contienen los criterios de evaluación cuando existan.

No inventes información que no aparezca en las imágenes.

Si alguna imagen no se puede leer con suficiente claridad, indícalo.
`
        : `

No hay imágenes adjuntas del enunciado ni de la rúbrica.

Utiliza únicamente la información textual disponible.
`;

    const finalUserContent: any[] = [
  {
    type: "text",

    text: `${message}

INFORMACIÓN DE LA TAREA:

Título:
${taskForAnalysis?.title || "No disponible"}

Asignatura:
${taskForAnalysis?.subject || "No disponible"}

Tipo:
${
  taskForAnalysis?.kind === "Trabajo"
    ? "Trabajo / proyecto"
    : "Tarea"
}

Fecha de entrega:
${taskForAnalysis?.date || "No disponible"}

Tiempo estimado:
${
  taskForAnalysis?.estimatedMinutes ??
  "No disponible"
} minutos

Prioridad:
${taskForAnalysis?.priority || "No disponible"}

Descripción:
${
  taskForAnalysis?.description ||
  "No hay descripción."
}

${taskImageInstruction}

MODO DE AYUDA:

La petición actual determina el formato de respuesta.

Si la petición solicita "Entender qué me piden", utiliza exactamente estos cuatro apartados:

QUÉ TIENES QUE HACER
EJERCICIOS O PARTES
QUÉ NECESITAS
CÓMO EMPEZAR

No añadas otros apartados.

La respuesta debe ser breve, clara y educativa.

No resuelvas los ejercicios ni proporciones respuestas para copiar.`,
  },

  ...taskImages,
];

const conversationMessages: any[] = [
  {
    role: "system",
    content: systemMessage,
  },

  ...history,

  {
    role: "user",
    content: finalUserContent,
  },
];
    console.log("🚀 ENVIANDO PETICIÓN A OPENROUTER");
console.log("🧠 Modelo:", "openrouter/free");
console.log("🖼️ Imágenes:", taskImages.length);
console.log(
  "📦 Mensajes:",
  conversationMessages.length,
);

const response =
  await openai.chat.completions.create(
    {
      model:
        "openrouter/free",

      messages:
        conversationMessages,

      tools,

      tool_choice:
        "auto",
    },
  );

console.log("✅ OPENROUTER RESPONDIÓ");
    
    const assistantMessage =
      response.choices[0]
        ?.message;

    const toolCalls =
      assistantMessage
        ?.tool_calls ?? [];

    const actions: any[] =
      [];

    for (
      const toolCall of toolCalls
    ) {
      if (
        toolCall.type !==
        "function"
      ) {
        continue;
      }

      if (
        toolCall.function
          .name !==
        "execute_esylern_actions"
      ) {
        continue;
      }

      try {
        const parsed =
          JSON.parse(
            toolCall.function
              .arguments,
          );

        if (
          Array.isArray(
            parsed?.actions,
          )
        ) {
          actions.push(
            ...parsed.actions,
          );
        }
      } catch (error) {
        console.error(
          "No se pudieron interpretar las acciones:",
          error,
        );
      }
    }

    const answer =
      typeof assistantMessage?.content ===
        "string" &&
      assistantMessage.content.trim()
        ? assistantMessage.content
        : actions.length >
            0
          ? "He realizado los cambios en tu planificación."
          : "No he podido generar una respuesta.";

    return res.status(200).json(
      {
        response: answer,
        actions,
      },
    );
  } catch (error: any) {
    console.error(
      "OPENROUTER ERROR COMPLETO:",
      error,
    );

    return res.status(500).json({
      error:
        error?.message ||
        error?.error?.message ||
        error?.response?.data?.error?.message ||
        "No se pudo conectar con Esylern AI.",
    });
  }
}

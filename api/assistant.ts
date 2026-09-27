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
                      enum: ["Baja", "Media", "Alta"],
                    },
                    estimatedMinutes: {
                      type: "number",
                    },
                    done: {
                      type: "boolean",
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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  try {
    const {
      message,
      tasks,
      exams,
      studyPlan,
      busySlots,
      studyDailyMinutes,
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Falta el mensaje.",
      });
    }

    const context = {
      tasks: Array.isArray(tasks) ? tasks : [],
      exams: Array.isArray(exams) ? exams : [],
      studyPlan: Array.isArray(studyPlan)
        ? studyPlan
        : [],
      busySlots: Array.isArray(busySlots)
        ? busySlots
        : [],
      studyDailyMinutes:
        typeof studyDailyMinutes === "number"
          ? studyDailyMinutes
          : 120,
    };
    const today = new Date();

const todayString = today.toLocaleDateString(
  "es-ES",
  {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  },
);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const tomorrowString =
  tomorrow.toISOString().split("T")[0];

    const response =
      await openai.chat.completions.create({
        model: "openrouter/free",

        messages: [
          {
            role: "system",
            content: `
Eres Esylern AI, el asistente inteligente de una aplicación de planificación académica.
FECHA ACTUAL:

Hoy es ${todayString}.

Cuando el estudiante utilice expresiones como "mañana",
"pasado mañana", "el viernes", "la semana que viene",
etc., debes convertirlas a una fecha concreta usando
la fecha actual.

Por ejemplo, si hoy es lunes 28 de septiembre de 2026,
"mañana" significa 2026-09-29.

Las fechas de tareas y exámenes deben guardarse siempre
en formato YYYY-MM-DD.

Nunca preguntes qué día significa "mañana" si puedes
calcularlo usando la fecha actual.

Ayudas al estudiante a organizar tareas, exámenes, estudio y disponibilidad.

Responde siempre en español salvo que el estudiante utilice claramente otro idioma.

Utiliza los datos reales proporcionados en el contexto.

Nunca inventes IDs.

Nunca inventes tareas, exámenes o periodos ocupados.

Si el estudiante quiere modificar algo existente, utiliza su ID real.

Si pide varias cosas, puedes ejecutar varias acciones.

Si falta un dato realmente necesario, pregunta antes de ejecutar una acción.

No elimines datos salvo que el estudiante lo pida claramente.

Cuando el estudiante quiera realizar cambios utiliza la herramienta execute_esylern_actions.

ACCIONES DISPONIBLES:

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
Modificar un examen.

delete_exam:
Eliminar un examen.

create_busy_slot:
Añadir un periodo ocupado.

delete_busy_slot:
Eliminar un periodo ocupado.

set_daily_study_minutes:
Cambiar el límite diario de estudio.

set_setting:
Modificar una configuración.

navigate:
Navegar a una sección de Esylern.

CONTEXTO ACTUAL:

${JSON.stringify(context, null, 2)}
            `,
          },

          {
            role: "user",
            content: message,
          },
        ],

        tools,

        tool_choice: "auto",
      });

    const assistantMessage =
      response.choices[0]?.message;

    const toolCalls =
      assistantMessage?.tool_calls ?? [];

    const actions: any[] = [];

    for (const toolCall of toolCalls) {
      if (toolCall.type !== "function") {
        continue;
      }

      if (
        toolCall.function.name !==
        "execute_esylern_actions"
      ) {
        continue;
      }

      try {
        const parsed = JSON.parse(
          toolCall.function.arguments,
        );

        if (Array.isArray(parsed?.actions)) {
          actions.push(...parsed.actions);
        }
      } catch (error) {
        console.error(
          "No se pudieron interpretar las acciones:",
          error,
        );
      }
    }

    const answer =
      typeof assistantMessage?.content === "string"
        ? assistantMessage.content
        : actions.length > 0
          ? "He realizado los cambios en tu planificación."
          : "No he podido generar una respuesta.";

    return res.status(200).json({
      response: answer,
      actions,
    });
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

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
      studyPlan: Array.isArray(studyPlan) ? studyPlan : [],
      busySlots: Array.isArray(busySlots) ? busySlots : [],
      studyDailyMinutes:
        typeof studyDailyMinutes === "number"
          ? studyDailyMinutes
          : 120,
    };

    /*
     * Todavía no llamamos a ningún modelo de IA.
     *
     * En el siguiente paso añadiremos aquí la conexión
     * con el proveedor de IA y la API key mediante
     * variables de entorno de Vercel.
     */

    return res.status(200).json({
      ok: true,
      message: "Servidor de Esylern preparado.",
      received: {
        userMessage: message,
        context,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}

function AssistantPage({
  tasks,
  exams,
  studyPlan,
  busySlots,
  studyDailyMinutes,
  onAction,
}: {
  tasks: Task[];
  exams: Exam[];
  studyPlan: StudySession[];
  busySlots: BusySlot[];
  studyDailyMinutes: number;
  onAction: (action: AssistantAction) => void;
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ASSISTANT_MESSAGES_KEY =
    "esylern_assistant_messages";

  const defaultAssistantMessage = {
    role: "ai" as const,
    text:
      "¡Hola! Soy Esylern AI. Ya tengo acceso a tus tareas, exámenes y plan de estudio. ¿En qué te ayudo?",
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState(false);

  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem(
        ASSISTANT_MESSAGES_KEY,
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(
        "No se pudo cargar la conversación:",
        error,
      );
    }

    return [defaultAssistantMessage];
  });

  useEffect(() => {
    localStorage.setItem(
      ASSISTANT_MESSAGES_KEY,
      JSON.stringify(messages),
    );
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();

    setMessage("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          tasks,
          exams,
          studyPlan,
          busySlots,
          studyDailyMinutes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "No se pudo conectar con Esylern AI.",
        );
      }

      /*
       * Ejecutamos las acciones que haya generado la IA.
       *
       * Cada acción pasa primero por executeAssistantAction()
       * en App.tsx, donde se modifica el estado real de Esylern.
       */
      if (Array.isArray(data?.actions)) {
        for (const action of data.actions) {
          try {
            onAction(action as AssistantAction);
          } catch (error) {
            console.error(
              "Error ejecutando acción de Esylern:",
              error,
            );
          }
        }
      }

      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text:
            data?.response ||
            "No he recibido una respuesta válida.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text:
            "Ha ocurrido un error al conectar con Esylern AI. Comprueba que la configuración de la IA esté correctamente configurada.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="INTELIGENCIA ARTIFICIAL"
        title="Asistente IA"
        subtitle="Habla con Esylern sobre tu estudio."
      />

      <div className="chat-card">
        <div className="chat-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
            }}
          >
            <div className="ai-avatar">
              <Sparkles size={18} />
            </div>

            <div>
              <strong>Esylern AI</strong>

              <span>
                {isLoading
                  ? "Pensando..."
                  : "Conectado a tu planificación"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="chat-clear-button"
            onClick={() =>
              setShowDeleteConfirmation(true)
            }
            aria-label="Borrar conversación"
            title="Borrar conversación"
          >
            <Trash2 size={17} />
          </button>
        </div>

        <div className="messages">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`message ${
                item.role === "user"
                  ? "user-message"
                  : "ai-message"
              }`}
            >
              {item.text
                .split("\n")
                .map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}

                    {lineIndex <
                      item.text.split("\n").length - 1 && (
                      <br />
                    )}
                  </React.Fragment>
                ))}
            </div>
          ))}

          {isLoading && (
            <div className="message ai-message">
              Esylern AI está pensando...
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Pregúntame algo sobre tu estudio..."
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={isLoading}
            aria-label="Enviar mensaje"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-modal">
            <div className="delete-confirmation-icon">
              <Trash2 size={20} />
            </div>

            <h3>¿Borrar conversación?</h3>

            <p>
              Esto eliminará la memoria de esta
              conversación con Esylern AI.
              <br />
              Tus tareas, exámenes y plan de estudio no se
              borrarán.
            </p>

            <div className="delete-confirmation-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={() =>
                  setShowDeleteConfirmation(false)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={() => {
                  setMessages([
                    defaultAssistantMessage,
                  ]);

                  localStorage.removeItem(
                    ASSISTANT_MESSAGES_KEY,
                  );

                  setShowDeleteConfirmation(false);
                }}
              >
                Borrar conversación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

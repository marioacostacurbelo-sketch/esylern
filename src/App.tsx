import { useState } from "react";
import {
  CalendarDays,
  CheckSquare,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  Brain,
  BarChart3,
  CircleCheck,
} from "lucide-react";

type Page =
  | "Dashboard"
  | "Calendario"
  | "Tareas"
  | "Exámenes"
  | "Plan de estudio"
  | "Asistente IA"
  | "Progreso"
  | "Configuración";

const menuItems: {
  label: Page;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Calendario", icon: CalendarDays },
  { label: "Tareas", icon: ListTodo },
  { label: "Exámenes", icon: GraduationCap },
  { label: "Plan de estudio", icon: Target },
  { label: "Asistente IA", icon: MessageCircle },
  { label: "Progreso", icon: TrendingUp },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("Dashboard");

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>

          <span>Esylern</span>
        </div>

        <nav className="navigation">
          <p className="navigation-title">MENÚ</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                className={`nav-item ${
                  currentPage === item.label ? "active" : ""
                }`}
                key={item.label}
                onClick={() => navigate(item.label)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${
              currentPage === "Configuración" ? "active" : ""
            }`}
            onClick={() => navigate("Configuración")}
          >
            <Settings size={19} />
            <span>Configuración</span>
          </button>

          <div className="pro-card">
            <div className="pro-icon">
              <Sparkles size={17} />
            </div>

            <div>
              <strong>Esylern PRO</strong>
              <p>Estudia de forma inteligente.</p>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">M</div>

            <div className="profile-info">
              <strong>Mi cuenta</strong>
              <span>Estudiante</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        {currentPage === "Dashboard" && (
          <Dashboard onNavigate={navigate} />
        )}

        {currentPage === "Calendario" && <CalendarPage />}

        {currentPage === "Tareas" && <TasksPage />}

        {currentPage === "Exámenes" && <ExamsPage />}

        {currentPage === "Plan de estudio" && <StudyPlanPage />}

        {currentPage === "Asistente IA" && <AssistantPage />}

        {currentPage === "Progreso" && <ProgressPage />}

        {currentPage === "Configuración" && <SettingsPage />}
      </main>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Viernes, 25 de septiembre</p>
          <h1>Buenos días 👋</h1>
          <p className="subtitle">
            Esto es lo que tienes pendiente hoy.
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => onNavigate("Tareas")}
        >
          <Plus size={18} />
          Añadir
        </button>
      </header>

      <section className="hero-card">
        <div>
          <div className="hero-label">
            <Sparkles size={16} />
            Tu plan de hoy
          </div>

          <h2>Un poco cada día.</h2>

          <p>
            Organiza tus tareas y exámenes para que Esylern te ayude
            a decidir qué hacer y cuándo.
          </p>

          <button
            className="primary-button"
            onClick={() => onNavigate("Plan de estudio")}
          >
            Crear mi plan de estudio
          </button>
        </div>

        <div className="hero-progress">
          <div className="progress-ring">
            <strong>0%</strong>
          </div>

          <span>Progreso de hoy</span>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CheckSquare size={19} />
          </div>

          <div>
            <span>Tareas pendientes</span>
            <strong>4</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <GraduationCap size={19} />
          </div>

          <div>
            <span>Próximo examen</span>
            <strong>12 días</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>Estudio esta semana</span>
            <strong>0 h</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={19} />
          </div>

          <div>
            <span>Objetivo semanal</span>
            <strong>0%</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Tareas de hoy</h3>
              <p>Lo que tienes pendiente</p>
            </div>

            <button
              className="text-button"
              onClick={() => onNavigate("Tareas")}
            >
              Ver todas
            </button>
          </div>

          <div className="empty-state">
            <div className="empty-icon">
              <ListTodo size={22} />
            </div>

            <h4>Aún no tienes tareas</h4>

            <p>
              Añade una tarea y empieza a organizar tu estudio.
            </p>

            <button
              className="secondary-button"
              onClick={() => onNavigate("Tareas")}
            >
              <Plus size={17} />
              Añadir tarea
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Próximos exámenes</h3>
              <p>Mantén tus fechas bajo control</p>
            </div>

            <button
              className="text-button"
              onClick={() => onNavigate("Exámenes")}
            >
              Ver exámenes
            </button>
          </div>

          <div className="empty-state">
            <div className="empty-icon">
              <CalendarDays size={22} />
            </div>

            <h4>No hay exámenes próximos</h4>

            <p>
              Añade tus próximos exámenes para planificar con tiempo.
            </p>

            <button
              className="secondary-button"
              onClick={() => onNavigate("Exámenes")}
            >
              <Plus size={17} />
              Añadir examen
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================
   CALENDARIO
========================= */

function CalendarPage() {
  const [month, setMonth] = useState("Septiembre 2026");

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZACIÓN"
        title="Calendario"
        subtitle="Visualiza tus clases, tareas y exámenes."
      />

      <div className="calendar-toolbar">
        <button
          className="icon-button"
          onClick={() => setMonth("Agosto 2026")}
        >
          <ChevronLeft size={18} />
        </button>

        <strong>{month}</strong>

        <button
          className="icon-button"
          onClick={() => setMonth("Octubre 2026")}
        >
          <ChevronRight size={18} />
        </button>

        <button className="add-button calendar-add">
          <Plus size={17} />
          Añadir evento
        </button>
      </div>

      <div className="calendar-card">
        <div className="calendar-week">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
            (day) => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ),
          )}
        </div>

        <div className="calendar-grid">
          {Array.from({ length: 35 }, (_, index) => {
            const day = index - 0;

            return (
              <div
                key={index}
                className={`calendar-cell ${
                  day === 25 ? "today" : ""
                }`}
              >
                <span>{day <= 30 ? day : ""}</span>

                {day === 25 && (
                  <div className="calendar-event">
                    Estudiar
                  </div>
                )}

                {day === 29 && (
                  <div className="calendar-event exam">
                    Examen
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* =========================
   TAREAS
========================= */

function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Ejercicios de matemáticas",
      subject: "Matemáticas",
      date: "Hoy",
      done: false,
    },
    {
      id: 2,
      title: "Leer capítulo 4",
      subject: "Lengua",
      date: "Hoy",
      done: false,
    },
    {
      id: 3,
      title: "Trabajo de historia",
      subject: "Historia",
      date: "Mañana",
      done: false,
    },
    {
      id: 4,
      title: "Problemas de física",
      subject: "Física",
      date: "27 sep.",
      done: false,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task,
      ),
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZACIÓN"
        title="Tareas"
        subtitle="Todo lo que tienes que hacer, en un solo lugar."
        action={
          <button className="add-button">
            <Plus size={18} />
            Nueva tarea
          </button>
        }
      />

      <div className="filter-row">
        <button className="filter active">Todas</button>
        <button className="filter">Pendientes</button>
        <button className="filter">Completadas</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            className={`task-card ${
              task.done ? "completed" : ""
            }`}
            key={task.id}
          >
            <button
              className={`task-check ${
                task.done ? "checked" : ""
              }`}
              onClick={() => toggleTask(task.id)}
            >
              {task.done && <CircleCheck size={19} />}
            </button>

            <div className="task-info">
              <strong>{task.title}</strong>
              <span>{task.subject}</span>
            </div>

            <div className="task-date">{task.date}</div>
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================
   EXÁMENES
========================= */

function ExamsPage() {
  const exams = [
    {
      subject: "Matemáticas",
      topic: "Funciones y derivadas",
      date: "7 octubre",
      days: "12 días",
    },
    {
      subject: "Historia",
      topic: "La Restauración",
      date: "14 octubre",
      days: "19 días",
    },
    {
      subject: "Inglés",
      topic: "Grammar & Vocabulary",
      date: "21 octubre",
      days: "26 días",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZACIÓN"
        title="Exámenes"
        subtitle="Ten todas tus fechas importantes bajo control."
        action={
          <button className="add-button">
            <Plus size={18} />
            Nuevo examen
          </button>
        }
      />

      <div className="exam-grid">
        {exams.map((exam) => (
          <div className="exam-card" key={exam.subject}>
            <div className="exam-icon">
              <GraduationCap size={22} />
            </div>

            <div className="exam-main">
              <span>{exam.subject}</span>
              <h3>{exam.topic}</h3>
              <p>{exam.date}</p>
            </div>

            <div className="exam-days">
              <strong>{exam.days}</strong>
              <span>restantes</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================
   PLAN DE ESTUDIO
========================= */

function StudyPlanPage() {
  return (
    <>
      <PageHeader
        eyebrow="INTELIGENCIA"
        title="Plan de estudio"
        subtitle="Esylern organiza tu tiempo y decide qué deberías hacer."
      />

      <section className="ai-banner">
        <div className="ai-banner-icon">
          <Sparkles size={21} />
        </div>

        <div>
          <strong>Tu planificación inteligente</strong>
          <p>
            Hemos tenido en cuenta tus exámenes, tareas y tiempo
            disponible.
          </p>
        </div>

        <button className="primary-button">
          <Sparkles size={16} />
          Generar plan
        </button>
      </section>

      <div className="plan-layout">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Hoy · Viernes 25</h3>
              <p>2 h 15 min de estudio recomendado</p>
            </div>
          </div>

          <div className="study-session">
            <div className="session-time">17:00</div>

            <div className="session-line"></div>

            <div className="session-content">
              <span className="session-tag">Matemáticas</span>
              <h4>Funciones y derivadas</h4>
              <p>Repasar teoría + hacer 8 ejercicios</p>
              <strong>1 h 15 min</strong>
            </div>
          </div>

          <div className="study-session">
            <div className="session-time">19:00</div>

            <div className="session-line"></div>

            <div className="session-content">
              <span className="session-tag">Historia</span>
              <h4>La Restauración</h4>
              <p>Leer apuntes y crear esquema</p>
              <strong>1 h</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Prioridades</h3>
              <p>En qué deberías centrarte</p>
            </div>
          </div>

          <div className="priority-list">
            <div className="priority-item">
              <span className="priority-number">1</span>
              <div>
                <strong>Matemáticas</strong>
                <p>Examen en 12 días</p>
              </div>
            </div>

            <div className="priority-item">
              <span className="priority-number">2</span>
              <div>
                <strong>Historia</strong>
                <p>Trabajo pendiente</p>
              </div>
            </div>

            <div className="priority-item">
              <span className="priority-number">3</span>
              <div>
                <strong>Inglés</strong>
                <p>Examen en 26 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   ASISTENTE IA
========================= */

function AssistantPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "¡Hola! Soy el asistente de Esylern. Puedo ayudarte a organizar tu estudio, priorizar tareas y preparar tus exámenes.",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    setMessages((current) => [
      ...current,
      { role: "user", text: userMessage },
      {
        role: "ai",
        text: "Perfecto. Cuando conectemos la IA real podré analizar tu calendario y decirte exactamente qué hacer y cuándo.",
      },
    ]);

    setMessage("");
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
          <div className="ai-avatar">
            <Sparkles size={18} />
          </div>

          <div>
            <strong>Esylern AI</strong>
            <span>Tu asistente de estudio</span>
          </div>
        </div>

        <div className="messages">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`message ${
                item.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              {item.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
            placeholder="Pregúntame algo sobre tu estudio..."
          />

          <button onClick={sendMessage}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================
   PROGRESO
========================= */

function ProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="PROGRESO"
        title="Tu progreso"
        subtitle="Mira cómo estás avanzando semana a semana."
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>Tiempo estudiado</span>
            <strong>8 h 30 min</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckSquare size={19} />
          </div>

          <div>
            <span>Tareas completadas</span>
            <strong>18</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={19} />
          </div>

          <div>
            <span>Objetivo semanal</span>
            <strong>68%</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={19} />
          </div>

          <div>
            <span>Racha actual</span>
            <strong>5 días</strong>
          </div>
        </div>
      </div>

      <div className="progress-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Horas de estudio</h3>
              <p>Esta semana</p>
            </div>

            <BarChart3 size={20} />
          </div>

          <div className="fake-chart">
            {[35, 55, 42, 70, 48, 82, 30].map(
              (height, index) => (
                <div className="chart-column" key={index}>
                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  ></div>

                  <span>
                    {["L", "M", "X", "J", "V", "S", "D"][index]}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Asignaturas</h3>
              <p>Tiempo dedicado</p>
            </div>
          </div>

          <div className="subject-progress">
            <ProgressItem
              name="Matemáticas"
              value={75}
            />

            <ProgressItem
              name="Historia"
              value={55}
            />

            <ProgressItem
              name="Inglés"
              value={40}
            />

            <ProgressItem
              name="Física"
              value={30}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ProgressItem({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div className="subject-item">
      <div className="subject-label">
        <span>{name}</span>
        <strong>{value}%</strong>
      </div>

      <div className="progress-bar">
        <div style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

/* =========================
   CONFIGURACIÓN
========================= */

function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="CUENTA"
        title="Configuración"
        subtitle="Personaliza Esylern a tu manera."
      />

      <div className="settings-grid">
        <div className="panel settings-panel">
          <div className="settings-title">
            <BookOpen size={19} />
            <div>
              <h3>Datos de estudio</h3>
              <p>Información que utiliza Esylern.</p>
            </div>
          </div>

          <label>
            Nivel educativo
            <select defaultValue="bachillerato">
              <option value="eso">ESO</option>
              <option value="bachillerato">Bachillerato</option>
              <option value="fp">FP</option>
              <option value="universidad">Universidad</option>
            </select>
          </label>

          <label>
            Curso
            <select defaultValue="2bach">
              <option value="1eso">1º ESO</option>
              <option value="4eso">4º ESO</option>
              <option value="1bach">1º Bachillerato</option>
              <option value="2bach">2º Bachillerato</option>
              <option value="universidad">Universidad</option>
            </select>
          </label>
        </div>

        <div className="panel settings-panel">
          <div className="settings-title">
            <Clock3 size={19} />
            <div>
              <h3>Tiempo disponible</h3>
              <p>Cuánto tiempo puedes estudiar.</p>
            </div>
          </div>

          <label>
            Horas entre semana
            <select defaultValue="2">
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="3">3 horas</option>
              <option value="4">4 horas</option>
            </select>
          </label>

          <label>
            Horas durante el fin de semana
            <select defaultValue="3">
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="3">3 horas</option>
              <option value="4">4 horas</option>
              <option value="5">5+ horas</option>
            </select>
          </label>
        </div>

        <div className="panel settings-panel">
          <div className="settings-title">
            <Brain size={19} />
            <div>
              <h3>Preferencias de estudio</h3>
              <p>Ayuda a la IA a conocerte mejor.</p>
            </div>
          </div>

          <label>
            Duración preferida
            <select defaultValue="50">
              <option value="25">25 minutos</option>
              <option value="50">50 minutos</option>
              <option value="90">90 minutos</option>
            </select>
          </label>

          <label>
            Momento preferido
            <select defaultValue="tarde">
              <option value="manana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
          </label>
        </div>
      </div>
    </>
  );
}

/* =========================
   COMPONENTES
========================= */

function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>

      {action}
    </header>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import type { ReactNode, FormEvent } from "react";
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
  Trash2,
  X,
} from "lucide-react";

type Page =
  | "Dashboard"
  | "Calendario"
  | "Tareas"
  | "Exámenes"
  | "Plan de estudio"
  | "Asistente IA"
  | "Progreso"
  | "Tiempo disponible"
  | "Configuración";

type Task = {
  id: number;
  title: string;
  subject: string;
  date: string;
  priority: "Baja" | "Media" | "Alta";
  estimatedMinutes: number;
  done: boolean;
};

type Exam = {
  id: number;
  subject: string;
  topic: string;
  date: string;
  studyMinutes: number;
};

type BusySlot = {
  id: number;
  day: number;
  startTime: string;
  endTime: string;
  repeatWeekly: boolean;
  date?: string;
};

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
  {
  label: "Tiempo disponible",
  icon: Clock3,
  page: "Tiempo disponible",
},
];

const initialTasks: Task[] = [];

const initialExams: Exam[] = [];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("Dashboard");

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("esylern_tasks");

    if (saved) {
  try {
    const parsed = JSON.parse(saved);

    return parsed.map((task: Task) => ({
      ...task,
      estimatedMinutes: task.estimatedMinutes ?? 30,
    }));
  } catch {
    return initialTasks;
  }
}

    return initialTasks;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem("esylern_exams");

    if (saved) {
  try {
    const parsed = JSON.parse(saved);

    return parsed.map((exam: Exam) => ({
      ...exam,
      studyMinutes: exam.studyMinutes ?? 120,
    }));
  } catch {
    return initialExams;
  }
}

    return initialExams;
  });
const [busySlots, setBusySlots] = useState<BusySlot[]>(() => {
  const saved = localStorage.getItem("esylern_busy_slots");

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  return [];
});
  useEffect(() => {
    localStorage.setItem("esylern_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("esylern_exams", JSON.stringify(exams));
  }, [exams]);
useEffect(() => {
  localStorage.setItem(
    "esylern_busy_slots",
    JSON.stringify(busySlots),
  );
}, [busySlots]);
  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const addTask = (task: Omit<Task, "id">) => {
    setTasks((current) => [
      ...current,
      {
        ...task,
        id: Date.now(),
      },
    ]);
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task,
      ),
    );
  };

  const deleteTask = (id: number) => {
    setTasks((current) =>
      current.filter((task) => task.id !== id),
    );
  };

  const addExam = (exam: Omit<Exam, "id">) => {
    setExams((current) => [
      ...current,
      {
        ...exam,
        id: Date.now(),
      },
    ]);
  };

  const deleteExam = (id: number) => {
    setExams((current) =>
      current.filter((exam) => exam.id !== id),
    );
  };

  const pendingTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);
  const nextExam = getNextExam(exams);

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
                key={item.label}
                className={`nav-item ${
                  currentPage === item.label ? "active" : ""
                }`}
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
          <Dashboard
            tasks={tasks}
            exams={exams}
            pendingTasks={pendingTasks}
            completedTasks={completedTasks}
            nextExam={nextExam}
            onNavigate={navigate}
            onToggleTask={toggleTask}
          />
        )}

        {currentPage === "Calendario" && (
          <CalendarPage tasks={tasks} exams={exams} />
        )}

        {currentPage === "Tareas" && (
          <TasksPage
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        )}

        {currentPage === "Exámenes" && (
          <ExamsPage
            exams={exams}
            onAddExam={addExam}
            onDeleteExam={deleteExam}
          />
        )}

        {currentPage === "Plan de estudio" && (
          <StudyPlanPage tasks={pendingTasks} exams={exams} />
        )}

        {currentPage === "Asistente IA" && <AssistantPage />}

        {currentPage === "Progreso" && (
          <ProgressPage
            tasks={tasks}
            completedTasks={completedTasks}
          />
        )}
        {currentPage === "Tiempo disponible" && (
  <AvailabilityPage
    busySlots={busySlots}
    setBusySlots={setBusySlots}
  />
)}

        {currentPage === "Configuración" && <SettingsPage />}
      </main>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({
  tasks,
  exams,
  pendingTasks,
  completedTasks,
  nextExam,
  onNavigate,
  onToggleTask,
}: {
  tasks: Task[];
  exams: Exam[];
  pendingTasks: Task[];
  completedTasks: Task[];
  nextExam: Exam | null;
  onNavigate: (page: Page) => void;
  onToggleTask: (id: number) => void;
}) {
  const today = new Date();

  const todayTasks = pendingTasks.filter(
    (task) => task.date === formatDateInput(today),
  );

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">{formatLongDate(today)}</p>

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

          <h2>
            {pendingTasks.length === 0
              ? "Todo despejado."
              : "Un poco cada día."}
          </h2>

          <p>
            {pendingTasks.length === 0
              ? "Añade tus tareas y exámenes para empezar a crear tu planificación."
              : `Tienes ${pendingTasks.length} ${
                  pendingTasks.length === 1
                    ? "tarea pendiente"
                    : "tareas pendientes"
                }.`}
          </p>

          <button
            className="primary-button"
            onClick={() => onNavigate("Plan de estudio")}
          >
            Crear mi plan de estudio
          </button>
        </div>

        <div className="hero-progress">
          <div
            className="progress-ring"
            style={{
              background: `conic-gradient(#172033 ${progress}%, #edf0f5 ${progress}% 100%)`,
            }}
          >
            <div className="progress-ring-inner">
              <strong>{progress}%</strong>
            </div>
          </div>

          <span>Progreso total</span>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CheckSquare size={19} />
          </div>

          <div>
            <span>Tareas pendientes</span>
            <strong>{pendingTasks.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <GraduationCap size={19} />
          </div>

          <div>
            <span>Próximo examen</span>
            <strong>
              {nextExam
                ? `${getDaysRemaining(nextExam.date)} días`
                : "—"}
            </strong>
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
            <strong>{progress}%</strong>
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

          {todayTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ListTodo size={22} />
              </div>

              <h4>No hay tareas para hoy</h4>

              <p>
                Añade una tarea con la fecha de hoy para verla aquí.
              </p>

              <button
                className="secondary-button"
                onClick={() => onNavigate("Tareas")}
              >
                <Plus size={17} />
                Añadir tarea
              </button>
            </div>
          ) : (
            <div className="mini-task-list">
              {todayTasks.slice(0, 4).map((task) => (
                <div className="mini-task" key={task.id}>
                  <button
                    className="task-check"
                    onClick={() => onToggleTask(task.id)}
                  />

                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.subject}</span>
                  </div>

                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          )}
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

          {exams.length === 0 ? (
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
          ) : (
            <div className="mini-exam-list">
              {[...exams]
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() -
                    new Date(b.date).getTime(),
                )
                .slice(0, 3)
                .map((exam) => (
                  <div className="mini-exam" key={exam.id}>
                    <div className="mini-exam-icon">
                      <GraduationCap size={18} />
                    </div>

                    <div>
                      <strong>{exam.subject}</strong>
                      <span>{exam.topic}</span>
                    </div>

                    <div className="mini-exam-days">
                      <strong>
                        {getDaysRemaining(exam.date)}
                      </strong>
                      <span>días</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* =========================
   TAREAS
========================= */

function TasksPage({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<
    "Todas" | "Pendientes" | "Completadas"
  >("Todas");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pendientes") return !task.done;
    if (filter === "Completadas") return task.done;

    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZACIÓN"
        title="Tareas"
        subtitle="Todo lo que tienes que hacer, en un solo lugar."
        action={
          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Nueva tarea
          </button>
        }
      />

      <div className="filter-row">
        {(["Todas", "Pendientes", "Completadas"] as const).map(
          (item) => (
            <button
              key={item}
              className={`filter ${
                filter === item ? "active" : ""
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>

      {showForm && (
        <TaskForm
          onAdd={(task) => {
            onAddTask(task);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {filteredTasks.length === 0 ? (
        <EmptyBox
          icon={<ListTodo size={24} />}
          title="No hay tareas"
          text="Añade tu primera tarea para empezar a organizarte."
          buttonText="Añadir tarea"
          onClick={() => setShowForm(true)}
        />
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
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
                onClick={() => onToggleTask(task.id)}
              >
                {task.done && <CircleCheck size={19} />}
              </button>

              <div className="task-info">
                <strong>{task.title}</strong>
                <span>
                  {task.subject} · {formatShortDate(task.date)} ·{" "}
{formatMinutes(task.estimatedMinutes)}
                </span>
              </div>

              <PriorityBadge priority={task.priority} />

              <button
                className="delete-button"
                onClick={() => onDeleteTask(task.id)}
                aria-label="Eliminar tarea"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TaskForm({
  onAdd,
  onCancel,
}: {
  onAdd: (task: Omit<Task, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [priority, setPriority] =
    useState<Task["priority"]>("Media");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !subject.trim() || !date) return;

    onAdd({
  title: title.trim(),
  subject: subject.trim(),
  date,
  priority,
  estimatedMinutes,
  done: false,
});
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-header">
        <div>
          <h3>Nueva tarea</h3>
          <p>Añade algo que tengas pendiente.</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={onCancel}
        >
          <X size={18} />
        </button>
      </div>

      <div className="form-grid">
        <label>
          Tarea
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Hacer ejercicios de matemáticas"
          />
        </label>

        <label>
          Asignatura
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Ej. Matemáticas"
          />
        </label>

        <label>
          Fecha
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <label>
          Prioridad
          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value as Task["priority"],
              )
            }
          >
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
        </label>
        <label>
  Tiempo estimado
  <select
    value={estimatedMinutes}
    onChange={(event) =>
      setEstimatedMinutes(Number(event.target.value))
    }
  >
    <option value={15}>15 minutos</option>
    <option value={30}>30 minutos</option>
    <option value={45}>45 minutos</option>
    <option value={60}>1 hora</option>
    <option value={90}>1 hora 30 minutos</option>
    <option value={120}>2 horas</option>
    <option value={150}>2 horas 30 minutos</option>
    <option value={180}>3 horas</option>
  </select>
</label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button type="submit" className="primary-button">
          <Plus size={17} />
          Crear tarea
        </button>
      </div>
    </form>
  );
}

/* =========================
   EXÁMENES
========================= */

function ExamsPage({
  exams,
  onAddExam,
  onDeleteExam,
}: {
  exams: Exam[];
  onAddExam: (exam: Omit<Exam, "id">) => void;
  onDeleteExam: (id: number) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const sortedExams = [...exams].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  );

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZACIÓN"
        title="Exámenes"
        subtitle="Ten todas tus fechas importantes bajo control."
        action={
          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Nuevo examen
          </button>
        }
      />

      {showForm && (
        <ExamForm
          onAdd={(exam) => {
            onAddExam(exam);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {sortedExams.length === 0 ? (
        <EmptyBox
          icon={<GraduationCap size={24} />}
          title="No tienes exámenes"
          text="Añade tus próximos exámenes para que Esylern pueda ayudarte a prepararlos."
          buttonText="Añadir examen"
          onClick={() => setShowForm(true)}
        />
      ) : (
        <div className="exam-grid">
          {sortedExams.map((exam) => (
            <div className="exam-card" key={exam.id}>
              <div className="exam-icon">
                <GraduationCap size={22} />
              </div>

              <div className="exam-main">
                <span>{exam.subject}</span>
                <h3>{exam.topic}</h3>
                <p>{formatLongDate(new Date(exam.date))}</p>
              </div>

              <div className="exam-days">
                <strong>
                  {getDaysRemaining(exam.date)}
                </strong>
                <span>restantes</span>
              </div>

              <button
                className="delete-button"
                onClick={() => onDeleteExam(exam.id)}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ExamForm({
  onAdd,
  onCancel,
}: {
  onAdd: (exam: Omit<Exam, "id">) => void;
  onCancel: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [studyMinutes, setStudyMinutes] = useState(120);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!subject.trim() || !topic.trim() || !date) return;

    onAdd({
  subject: subject.trim(),
  topic: topic.trim(),
  date,
  studyMinutes,
});
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-header">
        <div>
          <h3>Nuevo examen</h3>
          <p>Introduce los datos del examen.</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={onCancel}
        >
          <X size={18} />
        </button>
      </div>

      <div className="form-grid">
        <label>
          Asignatura
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Ej. Matemáticas"
          />
        </label>

        <label>
          Temario
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Ej. Funciones y derivadas"
          />
        </label>

        <label>
          Fecha del examen
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label>
  ¿Cuántas horas quieres dedicarle?
  <select
    value={studyMinutes}
    onChange={(event) =>
      setStudyMinutes(Number(event.target.value))
    }
  >
    <option value={30}>30 minutos</option>
    <option value={60}>1 hora</option>
    <option value={90}>1 h 30 min</option>
    <option value={120}>2 horas</option>
    <option value={180}>3 horas</option>
    <option value={240}>4 horas</option>
    <option value={300}>5 horas</option>
    <option value={360}>6 horas</option>
    <option value={480}>8 horas</option>
    <option value={600}>10 horas</option>
    <option value={900}>15 horas</option>
    <option value={1200}>20+ horas</option>
  </select>
  <small>
    Esylern repartirá este tiempo según los días que tengas disponibles.
  </small>
</label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button type="submit" className="primary-button">
          <Plus size={17} />
          Crear examen
        </button>
      </div>
    </form>
  );
}

/* =========================
   CALENDARIO
========================= */

function CalendarPage({
  tasks,
  exams,
}: {
  tasks: Task[];
  exams: Exam[];
}) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(2026, 8, 1),
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const mondayOffset =
    firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const totalCells =
    Math.ceil((mondayOffset + daysInMonth) / 7) * 7;

  const cells = Array.from(
    { length: totalCells },
    (_, index) => {
      const day = index - mondayOffset + 1;

      if (day < 1 || day > daysInMonth) {
        return null;
      }

      return day;
    },
  );

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString(
    "es-ES",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZACIÓN"
        title="Calendario"
        subtitle="Visualiza tus tareas y exámenes."
      />

      <div className="calendar-toolbar">
        <div className="calendar-navigation">
          <button
            className="icon-button"
            onClick={previousMonth}
          >
            <ChevronLeft size={18} />
          </button>

          <strong>
            {monthName.charAt(0).toUpperCase() +
              monthName.slice(1)}
          </strong>

          <button
            className="icon-button"
            onClick={nextMonth}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-card">
        <div className="calendar-week">
          {[
            "Lun",
            "Mar",
            "Mié",
            "Jue",
            "Vie",
            "Sáb",
            "Dom",
          ].map((day) => (
            <div className="calendar-day-name" key={day}>
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((day, index) => {
            if (!day) {
              return (
                <div
                  className="calendar-cell empty"
                  key={index}
                />
              );
            }

            const dateString = `${year}-${String(
              month + 1,
            ).padStart(2, "0")}-${String(day).padStart(
              2,
              "0",
            )}`;

            const dayTasks = tasks.filter(
              (task) => task.date === dateString,
            );

            const dayExams = exams.filter(
              (exam) => exam.date === dateString,
            );

            const todayString = formatDateInput(new Date());

            return (
              <div
                className={`calendar-cell ${
                  dateString === todayString ? "today" : ""
                }`}
                key={index}
              >
                <span className="calendar-number">
                  {day}
                </span>

                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    className={`calendar-event ${
                      task.done ? "done" : ""
                    }`}
                    key={task.id}
                  >
                    {task.title}
                  </div>
                ))}

                {dayExams.slice(0, 1).map((exam) => (
                  <div
                    className="calendar-event exam"
                    key={exam.id}
                  >
                    Examen: {exam.subject}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* =========================
   PLAN
========================= */

function StudyPlanPage({
  tasks,
  exams,
}: {
  tasks: Task[];
  exams: Exam[];
}) {
  const nextExam = getNextExam(exams);

  const sortedTasks = [...tasks].sort(
    (a, b) =>
      priorityValue(b.priority) - priorityValue(a.priority),
  );

  return (
    <>
      <PageHeader
        eyebrow="INTELIGENCIA"
        title="Plan de estudio"
        subtitle="Esylern organiza tu tiempo según tus prioridades."
      />

      <section className="ai-banner">
        <div className="ai-banner-icon">
          <Sparkles size={21} />
        </div>

        <div>
          <strong>Tu planificación inteligente</strong>

          <p>
            {nextExam
              ? `Tu próximo examen es ${nextExam.subject} y quedan ${getDaysRemaining(
                  nextExam.date,
                )} días.`
              : "Añade un examen para que Esylern pueda empezar a planificar tu preparación."}
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
              <h3>Prioridades actuales</h3>
              <p>Lo que deberías tener en cuenta primero</p>
            </div>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="empty-state">
              <Target size={28} />

              <h4>Aún no hay suficiente información</h4>

              <p>
                Añade tareas y exámenes para construir tu plan.
              </p>
            </div>
          ) : (
            <div className="priority-list">
              {sortedTasks.slice(0, 5).map((task, index) => (
                <div className="priority-item" key={task.id}>
                  <span className="priority-number">
                    {index + 1}
                  </span>

                  <div>
                    <strong>{task.title}</strong>

                    <p>
                      {task.subject} · Prioridad{" "}
                      {task.priority.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Cómo funcionará</h3>
              <p>La idea central de Esylern</p>
            </div>
          </div>

          <div className="feature-list">
            <Feature
              icon={<Target size={18} />}
              title="Priorizar"
              text="Detectar qué tienes que hacer primero."
            />

            <Feature
              icon={<Clock3 size={18} />}
              title="Repartir"
              text="Dividir el estudio entre los días disponibles."
            />

            <Feature
              icon={<Brain size={18} />}
              title="Adaptarse"
              text="Reorganizar el plan si no puedes estudiar un día."
            />
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
      {
        role: "user",
        text: userMessage,
      },
      {
        role: "ai",
        text: "Perfecto. Esta es la interfaz del asistente. Más adelante conectaremos una IA real que tendrá acceso a tu calendario, tareas y exámenes.",
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
                item.role === "user"
                  ? "user-message"
                  : "ai-message"
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
              if (event.key === "Enter") {
                sendMessage();
              }
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

function ProgressPage({
  tasks,
  completedTasks,
}: {
  tasks: Task[];
  completedTasks: Task[];
}) {
  const percentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks.length / tasks.length) * 100,
        );

  return (
    <>
      <PageHeader
        eyebrow="PROGRESO"
        title="Tu progreso"
        subtitle="Mira cómo estás avanzando."
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CheckSquare size={19} />
          </div>

          <div>
            <span>Tareas completadas</span>
            <strong>{completedTasks.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={19} />
          </div>

          <div>
            <span>Progreso total</span>
            <strong>{percentage}%</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>Tiempo estudiado</span>
            <strong>0 h</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={19} />
          </div>

          <div>
            <span>Racha actual</span>
            <strong>0 días</strong>
          </div>
        </div>
      </div>

      <div className="progress-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Progreso de tareas</h3>
              <p>Según las tareas que has creado</p>
            </div>

            <BarChart3 size={20} />
          </div>

          <div className="big-progress">
            <div className="big-progress-number">
              {percentage}%
            </div>

            <div className="big-progress-bar">
              <div
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <span>
              {completedTasks.length} de {tasks.length} tareas
              completadas
            </span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Próximamente</h3>
              <p>Estadísticas de estudio</p>
            </div>
          </div>

          <div className="feature-list">
            <Feature
              icon={<Clock3 size={18} />}
              title="Tiempo estudiado"
              text="Registra cuánto tiempo dedicas a cada asignatura."
            />

            <Feature
              icon={<TrendingUp size={18} />}
              title="Evolución"
              text="Observa cómo mejora tu constancia."
            />

            <Feature
              icon={<Target size={18} />}
              title="Objetivos"
              text="Comprueba si estás cumpliendo tus metas."
            />
          </div>
        </div>
      </div>
    </>
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

              <option value="bachillerato">
                Bachillerato
              </option>

              <option value="fp">FP</option>

              <option value="universidad">
                Universidad
              </option>
            </select>
          </label>

          <label>
            Curso

            <select defaultValue="2bach">
              <option value="1eso">1º ESO</option>

              <option value="4eso">4º ESO</option>

              <option value="1bach">
                1º Bachillerato
              </option>

              <option value="2bach">
                2º Bachillerato
              </option>
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
function AvailabilityPage({
  busySlots,
  setBusySlots,
}: {
  busySlots: BusySlot[];
  setBusySlots: React.Dispatch<React.SetStateAction<BusySlot[]>>;
}) {
  const [mode, setMode] = useState<"weekly" | "this-week">("weekly");
const [dragStart, setDragStart] = useState<{
  day: number;
  time: string;
} | null>(null);

const [isDragging, setIsDragging] = useState(false);
  const days = [
    { label: "Lunes", day: 0 },
    { label: "Martes", day: 1 },
    { label: "Miércoles", day: 2 },
    { label: "Jueves", day: 3 },
    { label: "Viernes", day: 4 },
    { label: "Sábado", day: 5 },
    { label: "Domingo", day: 6 },
  ];

  const times = Array.from({ length: 32 }, (_, index) => {
    const totalMinutes = 7 * 60 + index * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}`;
  });

  const toggleSlot = (day: number, time: string) => {
  const nextTime = addThirtyMinutes(time);

  const existing = busySlots.find(
    (slot) =>
      slot.day === day &&
      slot.startTime === time &&
      slot.endTime === nextTime &&
      slot.repeatWeekly === (mode === "weekly") &&
      (mode === "weekly" ||
        slot.date === getMondayOfCurrentWeek()),
  );

  if (existing) {
    setBusySlots((current) =>
      current.filter((slot) => slot.id !== existing.id),
    );
    return;
  }

  setBusySlots((current) => [
    ...current,
    {
      id: Date.now() + Math.random(),
      day,
      startTime: time,
      endTime: nextTime,
      repeatWeekly: mode === "weekly",
      date:
        mode === "this-week"
          ? getMondayOfCurrentWeek()
          : undefined,
    },
  ]);
};

  return (
    <section>
      <div className="topbar">
        <div>
          <div className="eyebrow">ORGANIZACIÓN</div>
          <h1>Tiempo disponible</h1>
          <p className="subtitle">
            Marca las horas en las que normalmente estás ocupado.
            El resto del tiempo estará disponible para estudiar.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>¿Cuándo estás ocupado?</h2>
            <p>
              Marca tus clases, entrenamientos, actividades o cualquier
              otro momento en el que no puedas estudiar.
            </p>
          </div>
        </div>

        <div className="filter-row">
          <button
            className={
              mode === "weekly"
                ? "primary-button"
                : "secondary-button"
            }
            onClick={() => setMode("weekly")}
          >
            🔁 Repetir todas las semanas
          </button>

          <button
            className={
              mode === "this-week"
                ? "primary-button"
                : "secondary-button"
            }
            onClick={() => setMode("this-week")}
          >
            📅 Solo esta semana
          </button>
        </div>

        <div className="availability-legend">
          <span>
            <span className="availability-dot free" />
            Disponible
          </span>

          <span>
            <span className="availability-dot busy" />
            Ocupado
          </span>
        </div>

        <div className="availability-calendar">
          <div className="availability-corner" />

          {days.map((day) => (
            <div
              key={day.day}
              className="availability-day-header"
            >
              {day.label}
            </div>
          ))}

          {times.map((time) => (
            <div key={time} className="availability-row">
              <div className="availability-time">
                {time}
              </div>

              {days.map((day) => {
                const busy = isBusy(day.day, time);

                return (
                  <button
                    key={`${day.day}-${time}`}
                    type="button"
                    className={`availability-cell ${
                      busy ? "busy" : ""
                    }`}
                    onClick={() => toggleSlot(day.day, time)}
                    aria-label={`${day.label} ${time}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <p className="availability-help">
          💡 No necesitas indicar qué haces durante ese tiempo.
          Esylern simplemente entenderá que esas horas no están
          disponibles para estudiar.
        </p>
      </div>
    </section>
  );
}

function addThirtyMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const totalMinutes = hours * 60 + minutes + 30;
  const nextHours = Math.floor(totalMinutes / 60);
  const nextMinutes = totalMinutes % 60;

  return `${String(nextHours).padStart(2, "0")}:${String(
    nextMinutes,
  ).padStart(2, "0")}`;
}

function getMondayOfCurrentWeek() {
  const date = new Date();
  const day = date.getDay();

  const difference = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + difference);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
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
  action?: ReactNode;
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

function EmptyBox({
  icon,
  title,
  text,
  buttonText,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="empty-page">
      <div className="empty-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>

      <button
        className="secondary-button"
        onClick={onClick}
      >
        <Plus size={17} />
        {buttonText}
      </button>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: Task["priority"];
}) {
  return (
    <span
      className={`priority-badge priority-${priority.toLowerCase()}`}
    >
      {priority}
    </span>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="feature-item">
      <div className="feature-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

/* =========================
   UTILIDADES
========================= */
function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}
function formatDateInput(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatShortDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function getDaysRemaining(dateString: string) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const target = new Date(`${dateString}T00:00:00`);

  target.setHours(0, 0, 0, 0);

  const difference =
    target.getTime() - today.getTime();

  return Math.max(
    0,
    Math.ceil(difference / (1000 * 60 * 60 * 24)),
  );
}

function getNextExam(exams: Exam[]) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const futureExams = exams
    .filter(
      (exam) =>
        new Date(`${exam.date}T00:00:00`).getTime() >=
        today.getTime(),
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    );

  return futureExams[0] ?? null;
}

function priorityValue(priority: Task["priority"]) {
  if (priority === "Alta") return 3;

  if (priority === "Media") return 2;

  return 1;
}

export default App;

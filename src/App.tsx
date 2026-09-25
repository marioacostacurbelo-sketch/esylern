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
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Calendario", icon: CalendarDays },
  { label: "Tareas", icon: ListTodo },
  { label: "Exámenes", icon: GraduationCap },
  { label: "Plan de estudio", icon: Target },
  { label: "Asistente IA", icon: MessageCircle },
  { label: "Progreso", icon: TrendingUp },
];

function App() {
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

          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                className={`nav-item ${index === 0 ? "active" : ""}`}
                key={item.label}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
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
        <header className="topbar">
          <div>
            <p className="eyebrow">Viernes, 25 de septiembre</p>
            <h1>Buenos días 👋</h1>
            <p className="subtitle">
              Esto es lo que tienes pendiente hoy.
            </p>
          </div>

          <button className="add-button">
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

            <button className="primary-button">
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

              <button className="text-button">Ver todas</button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">
                <ListTodo size={22} />
              </div>

              <h4>Aún no tienes tareas</h4>

              <p>
                Añade una tarea y empieza a organizar tu estudio.
              </p>

              <button className="secondary-button">
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

              <button className="text-button">Ver calendario</button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">
                <CalendarDays size={22} />
              </div>

              <h4>No hay exámenes próximos</h4>

              <p>
                Añade tus próximos exámenes para planificar con tiempo.
              </p>

              <button className="secondary-button">
                <Plus size={17} />
                Añadir examen
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

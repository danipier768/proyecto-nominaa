// ============================================
// PÁGINA DE DASHBOARD
// Archivo: src/pages/Dashboard.jsx
// ============================================

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user, isAdminOrRRHH } = useAuth();

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>🏠 Dashboard</h1>
                    <p>Bienvenido, <strong>{user?.username}</strong></p>
                </div>

                <div className="user-info-card">
                    <h2>📋 Información del Usuario</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Usuario:</span>
                            <span className="info-value">{user?.username}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user?.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Rol:</span>
                            <span className={`badge badge-${getRoleBadgeClass(user?.rol)}`}>
                                {user?.rol}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="cards-grid">
                    {/* Card de Empleados */}
                    <Link to="/employees" className="dashboard-card">
                        <div className="card-icon">👥</div>
                        <h3>Empleados</h3>
                        <p>Gestiona la información de los empleados</p>
                        <span className="card-action">Ver empleados →</span>
                    </Link>

                    {/* Card de Usuarios - Solo Admin y RRHH */}
                    {isAdminOrRRHH() && (
                        <Link to="/users" className="dashboard-card">
                            <div className="card-icon">🔐</div>
                            <h3>Usuarios</h3>
                            <p>Administra usuarios del sistema</p>
                            <span className="card-action">Gestionar usuarios →</span>
                        </Link>
                    )}

                    {/* Card de Nómina (próximamente) */}
                    <div className="dashboard-card disabled">
                        <div className="card-icon">💰</div>
                        <h3>Nómina</h3>
                        <p>Gestión de nómina y pagos</p>
                        <span className="card-action">Próximamente...</span>
                    </div>

                    {/* Card de Reportes (próximamente) */}
                    <div className="dashboard-card disabled">
                        <div className="card-icon">📊</div>
                        <h3>Reportes</h3>
                        <p>Genera reportes y estadísticas</p>
                        <span className="card-action">Próximamente...</span>
                    </div>
                </div>

                {/* Sección de accesos rápidos */}
                <div className="quick-actions">
                    <h2>⚡ Accesos Rápidos</h2>
                    <div className="actions-grid">
                        <Link to="/employees" className="quick-action-btn">
                            📋 Ver empleados
                        </Link>
                        {isAdminOrRRHH() && (
                            <Link to="/users" className="quick-action-btn">
                                ➕ Registrar usuario
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

// Función auxiliar para el color del badge según el rol
const getRoleBadgeClass = (rol) => {
    switch (rol) {
        case 'ADMINISTRADOR':
            return 'danger';
        case 'RRHH':
            return 'warning';
        case 'EMPLEADO':
            return 'info';
        default:
            return 'info';
    }
};

export default Dashboard;

// ============================================
// NOTAS
// ============================================

/*
FUNCIONALIDADES DEL DASHBOARD:

1. INFORMACIÓN DEL USUARIO:
   - Muestra datos del usuario logueado
   - Badge con color según el rol
   - Información personal (username, email, rol)

2. CARDS DE NAVEGACIÓN:
   - Empleados: Todos pueden acceder
   - Usuarios: Solo Admin y RRHH
   - Nómina y Reportes: Deshabilitados (próximamente)

3. ACCESOS RÁPIDOS:
   - Links directos a acciones comunes
   - Diferenciados por rol

4. NAVBAR:
   - Componente de navegación global
   - Logout, menú, etc.

PERMISOS:
- Todos los usuarios autenticados ven el dashboard
- Card de "Usuarios" solo visible para Admin y RRHH
- Cards deshabilitados muestran "Próximamente"

ESTILOS:
- Dashboard.css para estilos específicos
- Responsive design
- Cards interactivos con hover effects
*/
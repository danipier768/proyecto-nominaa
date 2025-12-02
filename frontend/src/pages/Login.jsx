// ============================================
// PÁGINA DE LOGIN
// Archivo: src/pages/Login.jsx
// ============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Estados del formulario
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ========================================
    // MANEJAR CAMBIOS EN LOS INPUTS
    // ========================================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar error al escribir
        setError('');
    };

    // ========================================
    // MANEJAR SUBMIT DEL FORMULARIO
    // ========================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                // Login exitoso, redirigir al dashboard
                navigate('/dashboard');
            } else {
                // Mostrar error
                setError(result.error || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error al conectar con el servidor', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Logo o título */}
                <div className="login-header">
                    <h1>🔐 Sistema de Nómina</h1>
                    <p>Inicia sesión para continuar</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Campo de usuario */}
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Ingresa tu usuario"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Campo de contraseña */}
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Ingresa tu contraseña"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Link de recuperación */}
                    <div className="form-footer">
                        <Link to="/forgot-password" className="forgot-link">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Botón de submit */}
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Información de prueba */}
                <div className="login-info">
                    <p><strong>Usuario de prueba:</strong></p>
                    <p>Usuario: admin</p>
                    <p>Contraseña: Admin123!</p>
                </div>
            </div>
        </div>
    );
};

export default Login;

// ============================================
// NOTAS
// ============================================

/*
FUNCIONALIDADES:
✅ Formulario de login con validación
✅ Manejo de errores
✅ Estado de carga (loading)
✅ Redirección al dashboard después del login
✅ Link a recuperación de contraseña
✅ Información de usuario de prueba

FLUJO:
1. Usuario ingresa credenciales
2. Click en "Iniciar Sesión"
3. Se muestra "Iniciando sesión..." (loading)
4. Se llama a la función login del contexto
5. Si es exitoso → Redirige a /dashboard
6. Si falla → Muestra mensaje de error

VALIDACIONES:
- Campos requeridos (HTML5 required)
- Error se limpia al escribir
- Botón deshabilitado mientras carga
- Inputs deshabilitados mientras carga
*/
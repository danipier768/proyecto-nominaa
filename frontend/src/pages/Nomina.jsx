import React from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import '../styles/Nomina.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Meses abreviados en español
const monthNamesEs = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const getCurrentMonthRange = () => {
  const now = new Date()
  const month = monthNamesEs[now.getMonth()]
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return `1 ${month} a ${lastDay} ${month}`
}

/** Formatea un número como peso colombiano */
const formatPesoColombiano = (value) => {
  const num = Number(value)
  if (isNaN(num)) return '–'
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

// Datos mock para el gráfico de gastos (últimos 6 meses)
const CHART_DATA = (() => {
  const now = new Date()
  const values = [980000, 1050000, 1120000, 1180000, 1200000, 1240500]
  const data = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthLabel = monthNamesEs[d.getMonth()].toUpperCase()
    data.push({
      month: monthLabel,
      value: values[5 - i] || 1000000,
      isCurrent: i === 0
    })
  }
  return data
})()

// Actividad reciente mock
const RECENT_ACTIVITY = [
  { id: 1, icon: 'fa-solid fa-circle-check', iconBg: 'success', title: 'Procesamiento de nómina del equipo de Desarrollo aprobado', subtitle: 'Procesado por Admin • Hace 2 horas', status: 'COMPLETADO', statusClass: 'completed' },
  { id: 2, icon: 'fa-solid fa-user-plus', iconBg: 'info', title: '3 nuevos empleados agregados al departamento de Ventas', subtitle: 'Flujo de incorporación iniciado • Hace 5 horas', status: 'EN PROGRESO', statusClass: 'in-progress' },
  { id: 3, icon: 'fa-solid fa-file-lines', iconBg: 'warning', title: 'Declaración de impuestos Q2 enviada', subtitle: 'Enviado a fiscalización • Ayer, 4:15 PM', status: 'ENVIADO', statusClass: 'submitted' }
]

export const Nomina = () => {
  const { user } = useAuth()
  const dateRange = getCurrentMonthRange()

  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const daysLeft = Math.max(0, lastDay.getDate() - now.getDate())
  const progressPercent = Math.round(((lastDay.getDate() - daysLeft) / lastDay.getDate()) * 100)

  return (
    <>
      <Navbar />
      <div className="nomina-container">
        {/* Header: título + rango de fechas + botón Generar Nómina */}
        <div className="nomina-header">
          <div>
            <h1>Descripción General de la Nómina</h1>
            <p>Bienvenido, <strong>{user?.username}</strong>. Aquí está el resumen del período actual.</p>
          </div>
          <div className="nomina-header-actions">
            <div className="nomina-date-range">
              <i className="fa-solid fa-calendar"></i>
              <span>{dateRange}</span>
            </div>
            <Link to="/directory" className="btn-generar-nomina">
              <i className="fa-solid fa-play"></i>
              <span>Generar Reporte</span>
            </Link>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="nomina-cards-grid">
          <div className="nomina-card">
            <div className="nomina-card-icon nomina-card-icon--blue">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
            <div>
              <p className="nomina-card-label">COSTO TOTAL NÓMINA</p>
              <p className="nomina-card-value">{formatPesoColombiano(1240500)}</p>
              <span className="nomina-card-change positive">+12.5%</span>
            </div>
          </div>
          <div className="nomina-card">
            <div className="nomina-card-icon nomina-card-icon--purple">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <p className="nomina-card-label">EMPLEADOS ACTIVOS</p>
              <p className="nomina-card-value">852</p>
              <span className="nomina-card-change positive">+3</span>
            </div>
          </div>
          <div className="nomina-card">
            <div className="nomina-card-icon nomina-card-icon--orange">
              <i className="fa-solid fa-building"></i>
            </div>
            <div>
              <p className="nomina-card-label">IMPUESTOS PRÓXIMOS</p>
              <p className="nomina-card-value">{formatPesoColombiano(45200)}</p>
              <span className="nomina-card-tag">Vence en 12d</span>
            </div>
          </div>
          <div className="nomina-card">
            <div className="nomina-card-icon nomina-card-icon--red">
              <i className="fa-solid fa-file-circle-check"></i>
            </div>
            <div>
              <p className="nomina-card-label">APROBACIONES PENDIENTES</p>
              <p className="nomina-card-value">12</p>
              <span className="nomina-card-tag urgent">Urgente</span>
            </div>
          </div>
        </div>

        {/* Gráfica + Próximo día de pago + Actividad reciente */}
        <div className="nomina-main-grid">
          {/* Gráfica de tendencias de gasto */}
          <div className="nomina-chart-card">
            <div className="nomina-chart-header">
              <h3>Tendencias de Gasto en Nómina</h3>
              <span className="nomina-chart-badge">Últimos 6 meses</span>
            </div>
            <div className="nomina-chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(2)}M`} />
                  <Tooltip formatter={(value) => [formatPesoColombiano(value), 'Gasto']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.isCurrent ? '#3b82f6' : '#93c5fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card próximo día de pago */}
          <div className="nomina-payday-card">
            <h3>PRÓXIMO DÍA DE PAGO</h3>
            <p className="nomina-payday-count">{daysLeft} DÍAS RESTANTES</p>
            <p className="nomina-payday-date">Próximo desembolso: {lastDay.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <div className="nomina-payday-progress">
              <span>PROGRESO</span>
              <div className="nomina-progress-bar">
                <div className="nomina-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Actividad reciente (sin Quick Actions) */}
        <div className="nomina-activity-section">
          <div className="nomina-activity-header">
            <h3>Actividad Reciente</h3>
            <Link to="#" className="nomina-view-all">Ver todo</Link>
          </div>
          <div className="nomina-activity-list">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="nomina-activity-item">
                <div className={`nomina-activity-icon ${item.iconBg}`}>
                  <i className={item.icon}></i>
                </div>
                <div className="nomina-activity-content">
                  <p className="nomina-activity-title">{item.title}</p>
                  <p className="nomina-activity-subtitle">{item.subtitle}</p>
                </div>
                <span className={`nomina-activity-status ${item.statusClass}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

import React, { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import '../styles/Directory.css'

/** Formatea un número como peso colombiano: $1.000.000 */
const formatPesoColombiano = (value) => {
  const num = Number(value)
  if (isNaN(num)) return '–'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const ROWS_PER_PAGE = 10

const EMPLOYEES_MOCK = [
  { id: 1, nombre: 'Daniel Mauricio Perez Rojas', identificacion: 'CC - 1090273907', cargo: 'Desarrollador', departamento: 'Desarrollo', salario_base: 1750000, estado: 'Activo' },
  { id: 2, nombre: 'María García López', identificacion: 'CC - 52345678', cargo: 'Diseñadora', departamento: 'Diseño', salario_base: 2100000, estado: 'Activo' },
  { id: 3, nombre: 'Carlos Rodríguez', identificacion: 'CC - 87654321', cargo: 'Analista', departamento: 'Contabilidad', salario_base: 1950000, estado: 'Activo' },
  { id: 4, nombre: 'Ana Martínez', identificacion: 'CC - 11223344', cargo: 'Recursos Humanos', departamento: 'RRHH', salario_base: 2200000, estado: 'Activo' },
  { id: 5, nombre: 'Luis Fernández', identificacion: 'CC - 55667788', cargo: 'DevOps', departamento: 'Desarrollo', salario_base: 2800000, estado: 'Activo' },
  { id: 6, nombre: 'Laura Sánchez', identificacion: 'CC - 99887766', cargo: 'QA', departamento: 'Desarrollo', salario_base: 1850000, estado: 'Activo' },
  { id: 7, nombre: 'Pedro Gómez', identificacion: 'CC - 44332211', cargo: 'Gerente', departamento: 'Operaciones', salario_base: 3500000, estado: 'Activo' },
  { id: 8, nombre: 'Sofia Herrera', identificacion: 'CC - 77889900', cargo: 'Asistente', departamento: 'Administración', salario_base: 1500000, estado: 'Activo' },
  { id: 9, nombre: 'Andrés Castro', identificacion: 'CC - 12341234', cargo: 'Desarrollador', departamento: 'Desarrollo', salario_base: 1900000, estado: 'Activo' },
  { id: 10, nombre: 'Carmen Díaz', identificacion: 'CC - 56785678', cargo: 'Contadora', departamento: 'Contabilidad', salario_base: 2400000, estado: 'Activo' },
  { id: 11, nombre: 'Roberto Vega', identificacion: 'CC - 90129012', cargo: 'Soporte', departamento: 'TI', salario_base: 1650000, estado: 'Activo' },
  { id: 12, nombre: 'Elena Mora', identificacion: 'CC - 34563456', cargo: 'Marketing', departamento: 'Comercial', salario_base: 2000000, estado: 'Activo' },
  { id: 13, nombre: 'Jorge Ramírez', identificacion: 'CC - 78907890', cargo: 'Desarrollador', departamento: 'Desarrollo', salario_base: 2050000, estado: 'Activo' },
  { id: 14, nombre: 'Patricia López', identificacion: 'CC - 23452345', cargo: 'Coordinadora', departamento: 'RRHH', salario_base: 2300000, estado: 'Activo' },
  { id: 15, nombre: 'Miguel Torres', identificacion: 'CC - 67896789', cargo: 'Sysadmin', departamento: 'TI', salario_base: 1950000, estado: 'Activo' },
  { id: 16, nombre: 'Claudia Ruiz', identificacion: 'CC - 45674567', cargo: 'Diseñadora UX', departamento: 'Diseño', salario_base: 2250000, estado: 'Activo' },
  { id: 17, nombre: 'Fernando Silva', identificacion: 'CC - 89018901', cargo: 'Auditor', departamento: 'Contabilidad', salario_base: 2600000, estado: 'Activo' },
  { id: 18, nombre: 'Lucía Mendoza', identificacion: 'CC - 12351235', cargo: 'Comunicaciones', departamento: 'Comercial', salario_base: 1800000, estado: 'Activo' },
  { id: 19, nombre: 'Ricardo Núñez', identificacion: 'CC - 56795679', cargo: 'Desarrollador', departamento: 'Desarrollo', salario_base: 1920000, estado: 'Activo' },
  { id: 20, nombre: 'Valentina Ortiz', identificacion: 'CC - 90139013', cargo: 'Asistente RRHH', departamento: 'RRHH', salario_base: 1550000, estado: 'Activo' },
]

export const Directory = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)



  const searchEmployees = () => {
    console.log(searchTerm)
  }

  const totalItems = EMPLOYEES_MOCK.length
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1
  const startIndex = (page - 1) * ROWS_PER_PAGE
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalItems)
  const currentRows = useMemo(() => EMPLOYEES_MOCK.slice(startIndex, endIndex), [startIndex, endIndex])

  const goToPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)))

  const paginationNumbers = useMemo(() => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page > 3) pages.push(1, '...')
      for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push('...', totalPages)
    }
    return pages
  }, [page, totalPages])

  const openEmployeeModal = (emp) => {
    setSelectedEmployee(emp)
    setShowModal(true)
    console.log(emp)
  };
  const closeEmployeeModal = () => {
    setSelectedEmployee(null)
    setShowModal(false)
  };

  return (<>
    <Navbar />

    <div className="directory-container">
      <h1>Directorio de Empleados</h1>
      {/* Buscador */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o identificación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchEmployees()}
        />
        <button onClick={searchEmployees} className="btn btn-gray-light">
          <i className="fa-solid fa-magnifying-glass"></i> Buscar
        </button>
        {searchTerm && (
          <button onClick={() => { setSearchTerm(''); searchEmployees(); }} className="btn btn-secondary">
            <i className="fa-solid fa-trash"></i> Limpiar
          </button>
        )}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Identificación</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Salario base</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.nombre}</td>
                <td>{emp.identificacion}</td>
                <td>{emp.cargo}</td>
                <td>{emp.departamento}</td>
                <td>{formatPesoColombiano(emp.salario_base)}</td>
                <td>{emp.estado}</td>
                <td>
                  <div className="action-buttons action-buttons--menu">
                    <button
                      type="button"
                      className="btn-action"
                      title="Más opciones"
                      aria-label="Más opciones"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEmployeeModal(emp)
                      }}
                    >
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="directory-pagination">
        <div className="directory-pagination__rows">
          <span>Filas por página: {ROWS_PER_PAGE}</span>
        </div>
        <div className="directory-pagination__info">
          Mostrando {startIndex + 1}-{endIndex} de {totalItems}
        </div>
        <div className="directory-pagination__controls">
          <button
            type="button"
            className="directory-pagination__btn"
            onClick={() => goToPage(1)}
            disabled={page === 1}
            aria-label="Primera página"
          >
            <i className="fa-solid fa-angles-left"></i>
          </button>
          <button
            type="button"
            className="directory-pagination__btn"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <div className="directory-pagination__numbers">
            {paginationNumbers.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="directory-pagination__ellipsis">…</span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`directory-pagination__btn directory-pagination__btn--number ${page === p ? 'directory-pagination__btn--active' : ''}`}
                  onClick={() => goToPage(p)}
                  aria-label={`Página ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            className="directory-pagination__btn"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Página siguiente"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <button
            type="button"
            className="directory-pagination__btn"
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
            aria-label="Última página"
          >
            <i className="fa-solid fa-angles-right"></i>
          </button>
        </div>
      </div>
    </div>
          {/* Modal de información del empleado */}
          {showModal && selectedEmployee && (
        <div className="modal-overlay" onClick={closeEmployeeModal}>
          <div className="modal-content payroll-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header del modal */}
            <div className="payroll-modal-header">
              <div className="payroll-header-left">
                <div className="employee-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div>
                  <h2>Ejecutar Nómina</h2>
                  <p className="employee-subtitle">
                    Procesando pago para <span className="employee-name-highlight">{selectedEmployee.nombre}</span> (EMP-{String(selectedEmployee.id).padStart(4, '0')})
                  </p>
                </div>
              </div>
              <button 
                onClick={closeEmployeeModal} 
                className="close-btn"
                aria-label="Cerrar modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="payroll-modal-body">
              {/* Sección: Período de Trabajo y Asistencia */}
              <div className="payroll-section">
                <h3 className="section-title">PERÍODO DE TRABAJO Y ASISTENCIA</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha Inicio</label>
                    <div className="input-with-icon">
                      <input type="date" defaultValue="2024-03-01" readOnly />
                      <i className="fa-solid fa-calendar"></i>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Fecha Fin</label>
                    <div className="input-with-icon">
                      <input type="date" defaultValue="2024-03-31" readOnly />
                      <i className="fa-solid fa-calendar"></i>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Días Trabajados</label>
                    <input type="number" defaultValue="24" readOnly />
                  </div>
                </div>
              </div>

              {/* Sección: Compensación por Horas Extra */}
              <div className="payroll-section">
                <div className="section-header-with-action">
                  <h3 className="section-title">COMPENSACIÓN POR HORAS EXTRA</h3>
                  <button type="button" className="btn-add-entry">
                    + Agregar Entrada
                  </button>
                </div>
                <div className="overtime-table">
                  <div className="overtime-table-header">
                    <div className="overtime-col-type">Tipo de Hora Extra</div>
                    <div className="overtime-col-hours">Horas</div>
                    <div className="overtime-col-rate">Tasa ($/hr)</div>
                    <div className="overtime-col-actions"></div>
                  </div>
                  <div className="overtime-table-row">
                    <div className="overtime-col-type">
                      <select defaultValue="recargo_nocturno" disabled>
                        <option value="hora_extra_diurna">Hora Extra Diurna (25%)</option>
                        <option value="recargo_nocturno">Recargo Nocturno (35%)</option>
                        <option value="hora_extra_nocturna">Hora Extra Nocturna (75%)</option>
                        <option value="recargo_dominical_festivo">Recargo Dominical y Festivo (90%)</option>
                        <option value="recargo_dominical_festivo_nocturno">Recargo Dominical/Festivo Nocturno (110%)</option>
                        <option value="hora_extra_dominical_festivo">Hora Extra Dominical/Festivo (100%)</option>
                        <option value="hora_extra_dominical_festivo_nocturno">Hora Extra Dominical/Festivo Nocturno (150%)</option>
                      </select>
                    </div>
                    <div className="overtime-col-hours">
                      <input type="number" defaultValue="8" readOnly />
                    </div>
                    <div className="overtime-col-rate">
                      <input type="number" defaultValue="0.00" step="0.01" readOnly />
                    </div>
                    <div className="overtime-col-actions">
                      <button type="button" className="btn-delete-entry">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="overtime-table-row">
                    <div className="overtime-col-type">
                      <select defaultValue="hora_extra_diurna" disabled>
                        <option value="hora_extra_diurna">Hora Extra Diurna (25%)</option>
                        <option value="recargo_nocturno">Recargo Nocturno (35%)</option>
                        <option value="hora_extra_nocturna">Hora Extra Nocturna (75%)</option>
                        <option value="recargo_dominical_festivo">Recargo Dominical y Festivo (90%)</option>
                        <option value="recargo_dominical_festivo_nocturno">Recargo Dominical/Festivo Nocturno (110%)</option>
                        <option value="hora_extra_dominical_festivo">Hora Extra Dominical/Festivo (100%)</option>
                        <option value="hora_extra_dominical_festivo_nocturno">Hora Extra Dominical/Festivo Nocturno (150%)</option>
                      </select>
                    </div>
                    <div className="overtime-col-hours">
                      <input type="number" defaultValue="4" readOnly />
                    </div>
                    <div className="overtime-col-rate">
                      <input type="number" defaultValue="127.5" step="0.01" readOnly />
                    </div>
                    <div className="overtime-col-actions">
                      <button type="button" className="btn-delete-entry">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Deducciones Obligatorias y Otras */}
              <div className="payroll-section">
                <h3 className="section-title">DEDUCCIONES OBLIGATORIAS Y OTRAS</h3>
                <div className="deductions-grid">
                  <div className="deduction-box">
                    <div className="deduction-label">Pensión Porcentaje</div>
                    <div className="deduction-value">4%</div>
                  </div>
                  <div className="deduction-box">
                    <div className="deduction-label">Porcentaje a Salud</div>
                    <div className="deduction-value">4%</div>
                  </div>
                  <div className="deduction-box">
                    <div className="deduction-label">Neto Pago</div>
                    <div className="deduction-value">{formatPesoColombiano(selectedEmployee.salario_base * 0.92)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal - Resumen */}
            <div className="payroll-modal-footer">
              <div className="summary-row">
                <span className="summary-label">Subtotal Bruto:</span>
                <span className="summary-value">{formatPesoColombiano(selectedEmployee.salario_base)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Deducciones:</span>
                <span className="summary-value summary-deductions">- {formatPesoColombiano(selectedEmployee.salario_base * 0.08)}</span>
              </div>
              <div className="summary-row summary-net">
                <span className="summary-label">Pago Neto:</span>
                <span className="summary-value summary-net-value">{formatPesoColombiano(selectedEmployee.salario_base * 0.92)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
  </>
  )
}


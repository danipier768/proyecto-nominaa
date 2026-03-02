// ============================================
// CONTROLADOR DE CATÁLOGOS
// Archivo: controllers/catalogController.js
// ============================================

/*
CATÁLOGOS DISPONIBLES:
- Cargos
- Departamentos
- Roles
- Tipos de Hora Extra (Colombia 2026)

Estos endpoints son para poblar los dropdowns/selects
del frontend.
*/

const { pool } = require("../config/database.js");

// ============================================
// 1. OBTENER TODOS LOS CARGOS
// ============================================
const getAllCargos = async (req, res) => {
  try {
    const [cargos] = await pool.query(
      `SELECT id_cargo, nombre_cargo
       FROM cargos 
       ORDER BY nombre_cargo`
    );

    res.json({
      success: true,
      data: cargos,
      count: cargos.length
    });

  } catch (error) {
    console.error('Error al obtener cargos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cargos'
    });
  }
};

// ============================================
// 2. OBTENER TODOS LOS DEPARTAMENTOS
// ============================================
const getAllDepartamentos = async (req, res) => {
  try {
    const [departamentos] = await pool.query(
      `SELECT id_departamento, nombre_departamento 
       FROM departamentos 
       ORDER BY nombre_departamento`
    );

    res.json({
      success: true,
      data: departamentos,
      count: departamentos.length
    });

  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener departamentos'
    });
  }
};

// ============================================
// 3. OBTENER TODOS LOS ROLES
// ============================================
const getAllRoles = async (req, res) => {
  try {
    const [roles] = await pool.query(
      `SELECT id_rol, nombre_rol 
       FROM roles 
       ORDER BY nombre_rol`
    );

    res.json({
      success: true,
      data: roles,
      count: roles.length
    });

  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles'
    });
  }
};

// ============================================
// 4. OBTENER TIPOS DE HORA EXTRA
// Opcional: ?fecha=YYYY-MM-DD para obtener tipos vigentes en esa fecha
// ============================================
const getAllTiposHoraExtra = async (req, res) => {
  try {
    const { fecha } = req.query;
    let query = `
      SELECT id_tipo_hora_extra, codigo, nombre, descripcion, 
             porcentaje_recargo, categoria, fecha_vigencia_inicio, fecha_vigencia_fin
      FROM tipo_hora_extra
    `;
    const params = [];

    if (fecha) {
      query += ` WHERE fecha_vigencia_inicio <= ? 
                 AND (fecha_vigencia_fin IS NULL OR fecha_vigencia_fin >= ?)
                 ORDER BY categoria, nombre`;
      params.push(fecha, fecha);
    } else {
      query += ` ORDER BY fecha_vigencia_inicio DESC, categoria, nombre`;
    }

    const [tipos] = await pool.query(query, params);

    res.json({
      success: true,
      data: tipos,
      count: tipos.length
    });

  } catch (error) {
    console.error('Error al obtener tipos de hora extra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tipos de hora extra'
    });
  }
};
// ============================================
// EXPORTAR FUNCIONES
// ============================================

module.exports = {
  getAllCargos,
  getAllDepartamentos,
  getAllRoles,
  getAllTiposHoraExtra
};
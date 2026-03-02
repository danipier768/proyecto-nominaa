// ============================================
// RUTAS DE CATÁLOGOS
// Archivo: routes/catalogRoutes.js
// ============================================

/*
ENDPOINTS DISPONIBLES:
- GET /api/catalogs/cargos - Lista de cargos
- GET /api/catalogs/departamentos - Lista de departamentos
- GET /api/catalogs/roles - Lista de roles
- GET /api/catalogs/tipos-hora-extra - Tipos de horas extra Colombia 2026 (?fecha=YYYY-MM-DD opcional)

Todos requieren autenticación
*/

const express = require('express');
const router = express.Router();

// Importar controlador
const {
    getAllCargos,
    getAllDepartamentos,
    getAllRoles,
    getAllTiposHoraExtra
} = require('../controllers/catalogController');

// Importar middlewares
const { verifyToken } = require('../middleware/authMiddleware');

// ============================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// ============================================

router.use(verifyToken);

// ============================================
// RUTAS
// ============================================

// GET /api/catalogs/cargos
router.get('/cargos', getAllCargos);

// GET /api/catalogs/departamentos
router.get('/departamentos', getAllDepartamentos);

// GET /api/catalogs/roles
router.get('/roles', getAllRoles);

// GET /api/catalogs/tipos-hora-extra (opcional: ?fecha=2026-02-15 para vigentes)
router.get('/tipos-hora-extra', getAllTiposHoraExtra);


// ============================================
// EXPORTAR ROUTER
// ============================================

module.exports = router;
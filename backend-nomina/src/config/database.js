
//
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistema_nomina',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise()


const DEFAULT_DEPARTMENTS = [
    'Gerencia General',
    'Administración',
    'Recursos Humanos (Gestión Humana)',
    'Finanzas',
    'Contabilidad',
    'Tesorería',
    'Compras',
    'Ventas',
    'Comercial',
    'Mercadeo (Marketing)',
    'Servicio al Cliente',
    'Operaciones',
    'Producción',
    'Logística',
    'Almacén / Bodega',
    'Tecnología de la Información (TI / Sistemas)',
    'Desarrollo de Software',
    'Infraestructura Tecnológica',
    'Seguridad de la Información',
    'Calidad',
    'Auditoría Interna',
    'Jurídica / Legal',
    'Planeación / Estrategia',
    'Investigación y Desarrollo (I+D)',
    'Mantenimiento',
    'Seguridad Física',
    'SST (Seguridad y Salud en el Trabajo)',
    'Proyectos (PMO)',
    'Ingeniería',
    'Diseño',
    'Operaciones de Campo',
    'Call Center',
    'Soporte Técnico',
    'Relaciones Públicas',
    'Comercio Exterior',
    'Abastecimiento',
    'Gestión Documental',
    'Capacitación',
    'Innovación',
    'Experiencia de Usuario (UX/UI)'
];

const ensureDefaultDepartments = async () => {
    try {
        const [rows] = await promisePool.query(`SELECT nombre_departamento FROM departamentos`);
        const existing = new Set(rows.map((row) => row.nombre_departamento.trim().toUpperCase()));

        const missing = DEFAULT_DEPARTMENTS.filter(
            (department) => !existing.has(department.trim().toUpperCase())
        );

        for (const department of missing) {
            await promisePool.query(
                `INSERT INTO departamentos (nombre_departamento) VALUES (?)`,
                [department]
            );
        }

        if (missing.length > 0) {
            console.log(`✅ Departamentos base sincronizados: ${missing.length} agregados`);
        }
    } catch (error) {
        console.error('❌ Error asegurando departamentos base:', error.message);
        throw error;
    }
};

const ensureEmployeeSalaryColumn = async () => {
    try {
        const dbName = process.env.DB_NAME || 'sistema_nomina';
        const [columns] = await promisePool.query(
            `SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = ?
               AND TABLE_NAME = 'empleados'
               AND COLUMN_NAME = 'sueldo'`,
            [dbName]
        );

        if (columns.length === 0) {
            await promisePool.query(
                `ALTER TABLE empleados
                 ADD COLUMN sueldo DECIMAL(12,2) NOT NULL DEFAULT 0.00
                 AFTER numero_identificacion`
            );
            console.log('✅ Columna empleados.sueldo creada automáticamente');
        }
    } catch (error) {
        console.error('❌ Error asegurando columna empleados.sueldo:', error.message);
        throw error;
    }
};


const testConnection = async () =>{
    try{
        const[rows] = await promisePool.query('SELECT 1 + 1 AS resultado')
        console.log('✅ Conexión a MySQL exitosa');
        console.log('📊 Base de datos:', process.env.DB_NAME);
        return true
    }catch(error){
        console.error('❌ Error al conectar a MySQL:', error.message);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    testConnection,
    ensureEmployeeSalaryColumn,
    ensureDefaultDepartments
} 
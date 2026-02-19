
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
    ensureEmployeeSalaryColumn
} 
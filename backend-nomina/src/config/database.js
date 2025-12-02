
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
    testConnection
}
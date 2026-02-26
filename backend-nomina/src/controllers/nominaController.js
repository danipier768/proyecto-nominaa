const { pool } = require('../config/database');

const VALID_PAYMENT_TYPES = new Set(['MENSUAL', 'QUINCENAL']);

const createPayroll = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      id_empleado,
      fecha_inicio,
      fecha_corte,
      tipo_pago,
      total_devengado,
      total_deducciones,
      detalles = []
    } = req.body;

    if (!id_empleado || !fecha_inicio || !fecha_corte) {
      return res.status(400).json({
        success: false,
        message: 'id_empleado, fecha_inicio y fecha_corte son obligatorios'
      });
    }

    const paymentType = VALID_PAYMENT_TYPES.has(tipo_pago) ? tipo_pago : 'MENSUAL';
    const devengado = Number(total_devengado) || 0;
    const deducciones = Number(total_deducciones) || 0;

    if (devengado < 0 || deducciones < 0) {
      return res.status(400).json({
        success: false,
        message: 'Los valores de nómina no pueden ser negativos'
      });
    }

    await connection.beginTransaction();

    const [payrollResult] = await connection.query(
      `INSERT INTO nomina (id_empleado, fecha_inicio, fecha_corte, tipo_pago, total_devengado, total_deducciones)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_empleado, fecha_inicio, fecha_corte, paymentType, devengado, deducciones]
    );

    const idNomina = payrollResult.insertId;

    if (Array.isArray(detalles) && detalles.length > 0) {
      const detailRows = detalles
        .filter((item) => item && item.concepto && Number(item.valor) >= 0)
        .map((item) => [idNomina, String(item.concepto).slice(0, 100), Number(item.valor)]);

      if (detailRows.length > 0) {
        await connection.query(
          `INSERT INTO detalle_nomina (id_nomina, concepto, valor) VALUES ?`,
          [detailRows]
        );
      }
    }

    await connection.commit();

    const [savedPayrollRows] = await connection.query(
      `SELECT id_nomina, id_empleado, fecha_inicio, fecha_corte, tipo_pago, total_devengado, total_deducciones, total_pagar
       FROM nomina
       WHERE id_nomina = ?`,
      [idNomina]
    );

    return res.status(201).json({
      success: true,
      message: 'Nómina guardada exitosamente',
      data: savedPayrollRows[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creando nómina:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Error guardando la nómina'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  createPayroll
};

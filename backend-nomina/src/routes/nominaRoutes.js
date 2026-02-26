const express = require('express');
const router = express.Router();

const { createPayroll } = require('../controllers/nominaController');
const { verifyToken, verifyAdminORRRHH } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', verifyAdminORRRHH, createPayroll);

module.exports = router;

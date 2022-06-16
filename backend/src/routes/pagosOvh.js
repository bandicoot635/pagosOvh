const { Router } = require('express');
const router = Router();
const {  consultarAlumno, getPagos } = require('../controllers/pagosOvh.controller');


router.get('/pagos', getPagos);
router.post('/alumnos', consultarAlumno);

module.exports = router;
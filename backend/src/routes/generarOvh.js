const { Router } = require('express');
const router = Router();
const { generarPorPrimeraVez, generarOvhVencido, consultarLineCaptura, validarFecha } = require('../controllers/generarOvh');

router.post('/ovh/generar', generarPorPrimeraVez);
router.post('/ovh/recuperar', consultarLineCaptura); 
router.post('/ovh/validarFecha', validarFecha);
router.post('/ovh/generarVencido', generarOvhVencido);

module.exports = router;
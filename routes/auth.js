const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Crear nuevo usuario
router.post('/new', [
    check('name', 'El nombre es obligatorio y debe tener al menos 4 caracteres').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio y debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], crearUsuario);

//Login usuario
router.post('/', [
    // check('name', 'El nombre es obligatorio y debe tener al menos 4 caracteres').not().isEmpty(), //.isLength({ min: 4 }),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio y debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], loginUsuario);

//Renovar Token
router.get('/renew', validarJWT, renewToken);

module.exports = router;
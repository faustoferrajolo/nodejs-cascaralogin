const { response } = require("express");
const Usuario = require('../models/Usuario');
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {

    const { email, name, password } = req.body;

    try {


        //Check email

        const usuario = await Usuario.findOne({ email }); // Se puede usar así o sino email: email

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe en la base de datos'
            })
        }
        //Create user
        const dbUser = new Usuario(req.body);

        //Encrypt pass
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //Generate JWT
        const token = await generarJWT(dbUser.uid, dbUser.name);

        //Create user on DB
        await dbUser.save();


        //Generate success response
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            msg: 'El registro se creo satisfactoriamente',
            token: token
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ups... algo salió mal creando el usuario'
        });
    }





}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        //Confirmar password match

        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            });
        }

        // generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);



        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            msg: 'El login fue exitoso',
            token
        });




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ups... algo salió mal durante el login'
        });

    }


}

//Token validation

const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    // Generar el JWT
    const token = await generarJWT(uid, name);

    return res.status(200).json({
        ok: true,
        uid,
        name,
        msg: 'Token renovado',
        token
    });
}




module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}
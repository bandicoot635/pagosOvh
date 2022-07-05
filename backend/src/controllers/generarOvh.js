const { response } = require('express');
const { Pool } = require('pg');
var soap = require('soap');

const pool = new Pool({
    host: process.env.HOST_BD,
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    database: process.env.DATABASE_BD,
    port: process.env.PORT_BD
})

const generarPorPrimeraVez = async (req, res) => {

    const {
        numero,
        fecha,
        descripcion,
        nombre,
        curp
    } = req.body;

    // const [numero1, numero2]=numero
    // console.log(numero);

    var args = {
        pComunidad: 'CECYTEV',
        pUsuario: 'CECYTEV-WS',
        pPassword: 'CECYTEV@PSW$',
        pReferencias: numero,
        pCantidadBase: '1',
        pNoMunicipio: 200,
        pFechaCaducidad: fecha,
        pNombre: nombre,
        pRfc: '',
        pFolioExterno: '1',
        pObservacion: ''
    }

    var soapOptions = {
        forceSoap12Headers: true
    };

    const URL = 'http://gevoasapp.veracruz.gob.mx/WSGenerarLineaCaptura/WSGenerarLineaCapturaSoap12HttpPort?WSDL';

    soap.createClient(URL, soapOptions, function (err, client) {
        if (!err) {
            // client.addSoapHeader(addSoapHeader);
            client.wsGeneraAdeudoReferencias(args, function (err, response) {

                if (!err) {
                    var lineaCaptura = response.result.plineacapturaOut;
                    var monto = response.result.pimporteOut;


                    // if (lineaCaptura.length != 0) {

                    //     const queri = 'INSERT INTO "lineasCaptura"( nombre, "CURP", "lineaCaptura", plantel, estatus, "fechaVigencia",  "numeroReferencia", descripcion, monto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
                    //     const response = pool.query(queri, [nombre, curp, lineaCaptura, 10, "Vigente", fecha, numero, descripcion, monto]);
                    // }

                    res.json(lineaCaptura); //Se manda como respuesta la linea de captura

                } else {
                    console.log('Error en el Servicio', err);
                    console.log(err);
                }

            });
        } else {
            console.log('Error al Crear el Cliente: ', err);
        }
    });

}

//En este endpoint se consulta la tabla linea de capturas para ver si encuentra una coincidiencia.
const consultarLineCaptura = async (req, res) => {

    let {
        curp
    } = req.body;

    const queri = 'SELECT * FROM "lineasCaptura" WHERE "CURP" = $1 ';
    const response = await pool.query(queri, [curp]);
    res.json(response.rows);

}

const validarFecha = async (req, res) => {

    const {
        fechaVigencia
    } = req.body;


    let fechaUsuario = new Date(fechaVigencia)
    let fechaHoy = new Date()

    fechaUsuario.setHours(0, 0, 0, 0);
    fechaHoy.setHours(0, 0, 0, 0);

    if (fechaUsuario.getTime() >= fechaHoy.getTime()) {
        // console.log("La linea de captura aun esta vigente");
        let dif = (fechaUsuario.getTime() - fechaHoy.getTime()) / (1000 * 60 * 60 * 24)
        // console.log(dif);
        res.json({
            dias: dif,
            fecha: true,//true
        });
    } else {
        // console.log("La linea de captura se vencio");
        res.json({
            fecha: false,
        });
    }

}

const generarOvhVencido = async (req, res) => {

    const {
        CURP,
        lineaCaptura,
        nombre,
        numeroReferencia
    } = req.body;
    console.log(req.body);


    //Aqui se consulta la fecha del dia de hoy y se le suman 7 dias que sera la vigencia que tendra la linea de captura
    let fechaHoy = new Date()
    fechaHoy.setDate(fechaHoy.getDate() + 7)
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    let fecha = fechaHoy.getDate() + "/" + months[fechaHoy.getMonth()] + "/" + fechaHoy.getFullYear();

    var args = {
        pComunidad: 'CECYTEV',
        pUsuario: 'CECYTEV-WS',
        pPassword: 'CECYTEV@PSW$',
        pReferencias: numeroReferencia,
        pCantidadBase: '1',
        pNoMunicipio: 200,
        pFechaCaducidad: fecha,
        pNombre: nombre,
        pRfc: '',
        pFolioExterno: '1',
        pObservacion: ''
    }

    var soapOptions = {
        forceSoap12Headers: true
    };

    const URL = 'http://gevoasapp.veracruz.gob.mx/WSGenerarLineaCaptura/WSGenerarLineaCapturaSoap12HttpPort?WSDL';

    soap.createClient(URL, soapOptions, function (err, client) {
        if (!err) {
            // client.addSoapHeader(addSoapHeader);
            client.wsGeneraAdeudoReferencias(args, function (err, response) {

                if (!err) {
                    var a = response.result.plineacapturaOut;
                    var monto = response.result.pimporteOut;
                    // console.log('Respuesta: ', response.result.plineacapturaOut);

                    if (a.length != 0) {
                        const queri = 'UPDATE "lineasCaptura" SET "lineaCaptura"=$1, estatus=$2, "fechaVigencia"=$3, monto=$4 WHERE "lineaCaptura" = $5';
                        const response2 = pool.query(queri, [a, "vigente", fecha, monto, lineaCaptura]);
                    }

                    res.json(a); //Se manda como respuesta la linea de captura

                } else {
                    console.log('Error en el Servicio', err);
                }

            });
        } else {
            console.log('Error al Crear el Cliente: ', err);
        }
    });

}

module.exports = {
    generarPorPrimeraVez,
    consultarLineCaptura,
    validarFecha,
    generarOvhVencido
}
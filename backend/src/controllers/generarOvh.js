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

    const { fecha, numero, nombre, cantidad, curp } = req.body;

    const query = 'SELECT id_alumno FROM alumnos WHERE "CURP" = $1'
    const response = await pool.query(query, [curp]);
    const id_alumno = response.rows[0].id_alumno

    var args = {
        pComunidad: 'CECYTEV',
        pUsuario: 'CECYTEV-WS',
        pPassword: 'CECYTEV@PSW$',
        pReferencias: numero,
        pCantidadBase: cantidad,
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

                    try {

                        let lineaCaptura = response.result.plineacapturaOut.trim();
                        let monto = response.result.pimporteOut;
    
                        const query = 'INSERT INTO "lineasCaptura"(plantel, estatus, "lineaCaptura", id_pago, monto, "fechaVigencia", id_alumno, cantidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
                        const response1 = pool.query(query, [10, "vigente", lineaCaptura, numero, monto, fecha, id_alumno, cantidad]);
    
                        res.json(lineaCaptura); //Se manda como respuesta la linea de captura
                        
                    } catch (error) {
                        res.status(500).json({ error: 'Error en la consulta' })
                    }
                   

                } else {
                    res.status(500).json({ error: 'Error en el servicio' })
                }

            });
        } else {
            res.status(500).json({ error: 'Error al crear el cliente' })
        }
    });
}

//En este endpoint se consulta la tabla linea de capturas para ver si encuentra una coincidiencia.
const consultarLineCaptura = async (req, res) => {

    let {
        curp
    } = req.body;

    let expresion = /[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}/

    if (!curp.match(expresion)) {

        res.status(400).json({
            error: 'El CURP ingresado no es valido'
        })

    } else {

        try {

            const queri = 'SELECT id_alumno FROM alumnos WHERE "CURP" = $1'
            const response = await pool.query(queri, [curp]);

            if (!response.rows[0]) {
                res.status(400).json({
                    error: 'El alumno no existe en nuestra base de datos'
                })
            } else {
                try {
                    const query = 'SELECT * FROM "lineasCaptura" WHERE id_alumno = $1'
                    const response2 = await pool.query(query, [response.rows[0].id_alumno]);

                    if (!response2.rows[0]) {
                        res.status(400).json({
                            error: 'No haz generado ningun pago'
                        })
                    } else {
                        res.json(response2.rows); //Si pasa todas las validaciones aqui se envia la data
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        error: "Fallo la consulta"
                    })
                }
            }


        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "Fallo la consulta"
            })
        }


    }
}

const validarFecha = async (req, res) => {

    const { fechaVigencia } = req.body;


    let fechaUsuario = new Date(fechaVigencia)
    let fechaHoy = new Date()

    fechaUsuario.setHours(0, 0, 0, 0);
    fechaHoy.setHours(0, 0, 0, 0);

    if (fechaUsuario.getTime() >= fechaHoy.getTime()) {
        let dif = (fechaUsuario.getTime() - fechaHoy.getTime()) / (1000 * 60 * 60 * 24)
        res.json({
            dias: dif,
            fecha: true,//true
        });
    } else {
        res.json({
            fecha: false,
        });
    }

}

const generarOvhVencido = async (req, res) => {

    const { id_pago, cantidad, id_alumno } = req.body;

    const query = 'SELECT nombre FROM alumnos WHERE id_alumno = $1'
    const response = await pool.query(query, [id_alumno]);
    const nombreAlumno = response.rows[0].nombre

    //Aqui se consulta la fecha del dia de hoy y se le suman 7 dias que sera la vigencia que tendra la linea de captura
    let fechaHoy = new Date()
    fechaHoy.setDate(fechaHoy.getDate() + 7)
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    let fecha = fechaHoy.getDate() + "/" + months[fechaHoy.getMonth()] + "/" + fechaHoy.getFullYear();

    var args = {
        pComunidad: 'CECYTEV',
        pUsuario: 'CECYTEV-WS',
        pPassword: 'CECYTEV@PSW$',
        pReferencias: id_pago,
        pCantidadBase: cantidad,
        pNoMunicipio: 200,
        pFechaCaducidad: fecha,
        pNombre: nombreAlumno,
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

                    try {
                        let lineaCaptura = response.result.plineacapturaOut.trim();
                        let monto = response.result.pimporteOut;
    
                        const queri = 'INSERT INTO "lineasCaptura"(plantel, estatus, "lineaCaptura", id_pago, monto, "fechaVigencia", id_alumno, cantidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
                        const response1 = pool.query(queri, [10, "vigente", lineaCaptura, id_pago, monto, fecha, id_alumno, cantidad]);
    
                        res.json(lineaCaptura); //Se manda como respuesta la linea de captura
    
                    } catch (error) {
                        res.status(500).json({ error: 'Error en la consulta' })
                    }
                   
                } else {
                    res.status(500).json({ error: 'Error en el servicio' })
                }

            });
        } else {
            res.status(500).json({ error: 'Error al crear el cliente' })
        }
    });

}

module.exports = {
    generarPorPrimeraVez,
    consultarLineCaptura,
    validarFecha,
    generarOvhVencido
}
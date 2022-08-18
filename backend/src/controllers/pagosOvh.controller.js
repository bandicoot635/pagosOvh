const { response, request } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.HOST_BD,
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    database: process.env.DATABASE_BD,
    port: process.env.PORT_BD
})

const getPagos = async (req = request, res = response) => {  //?desde=0&limt=9

    const { desde = 0, limt = 12 } = req.query

    try {
        const query = 'SELECT * FROM "pagos" WHERE plantel=16 or plantel=0 ORDER BY id_pago OFFSET $1 LIMIT $2';
        const response = await pool.query(query, [desde, limt]);
        // console.log(response.rows.length);
        res.json(response.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Fallo la consulta de los pagos"
        })
    }


};


const consultarAlumno = async (req = request, res = response) => {

    let {
        termino,
        boolean,
    } = req.body;

    const expresion = /[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}/
    let respuesta
    let query = "";

    if (boolean) {
        if (!termino.match(expresion)) {
            res.status(400).json({
                error: 'Curp ingresada no valida'
            })
        } else {

            try {
                query = 'SELECT * FROM "alumnos" WHERE "CURP" = $1'
                respuesta = await pool.query(query, [termino]);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    error: "Fallo la consulta del alumno"
                })
            }

            if (!respuesta.rows[0]) {
                res.status(400).json({
                    error: 'El alumno no existe en nuestra base de datos'
                })

            } else {
                res.json(respuesta.rows[0]); //Solo se debe de devolver un alumno 
            }
        }

    } else {
        try {
            query = 'SELECT * FROM "alumnos" WHERE matricula = $1'
            respuesta = await pool.query(query, [termino]);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "Fallo la consulta del alumno"
            })
        }
        if (!respuesta.rows[0]) {
            res.status(400).json({
                error: 'El alumno no existe en nuestra base de datos'
            })

        } else {
            res.json(respuesta.rows[0]); //Solo se debe de devolver un alumno 
        }
        
    }


    
    /*   if (!termino.match(expresion)aqui se tendria que agregar la expresion para la matricula) {
   
           res.status(400).json({
               error: 'CURP o matricula ingresados no son validos'
           })
   
       } else {
   
           try {
   
               let query = "";
   
               boolean ? query = 'SELECT * FROM "alumnos" WHERE "CURP" = $1 ' : query = 'SELECT * FROM "alumnos" WHERE matricula = $1 '
   
               const response = await pool.query(query, [termino]);
               if (!response.rows[0]) {
                   res.status(400).json({
                       error: 'El alumno no existe en nuestra base de datos'
                   })
   
               }else{
                   res.json(response.rows[0]); //Solo se debe de devolver un alumno 
               }
   
           } catch (error) {
               console.log(error);
               res.status(500).json({
                   error:"Fallo la consulta del alumno"
               })
           }
       }*/
};


module.exports = {
    getPagos,
    consultarAlumno,
}
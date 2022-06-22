const { response } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.HOST_BD,
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    database: process.env.DATABASE_BD,
    port: process.env.PORT_BD
})

const getPagos = async (req, res) => {
    const response = await pool.query('SELECT * FROM "Pagos" WHERE plantel=16 or plantel=0;');
    res.json(response.rows);
};



const consultarAlumno = async (req, res) => {

    let {
        termino,
        boolean,
    } = req.body;

    let queri = "";

    if (boolean) {
      queri = 'SELECT * FROM "alumnos" WHERE "CURP" = $1 ';
    } else {
      queri = 'SELECT * FROM "alumnos" WHERE matricula = $1 ';
    }

    const response = await pool.query(queri, [termino]);
    // console.log(queri, [termino]);
    // console.log(response.rows);

    res.json(response.rows[0]); //Solo se debe de devolver un alumno 

};


module.exports = {
    getPagos,
    consultarAlumno,
}
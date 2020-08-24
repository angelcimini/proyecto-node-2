const mysql = require('mysql');

const { promisify } = require('util');
//permite usar promesas. obtener el módulo "promisify" de la biblioteca "util"

const { database } = require('./keys');
// importar la propiedad "database" del archivo de conexión src/keys.js 

const pool = mysql.createPool(database);
// crear la constante de conexión "pool" a partir del objeto "database" de src/keys.js

pool.getConnection((err, connection) => {
// crear conexión pudiendo obtener un error o una conexión 
    if(err){
    //si tengo un error...
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        //si tengo el error 'PROTOCOL_CONNECTION_LOST' significa que se ha perdido la conexión a la DB

        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        // si tengo un error 'ER_CON_COUNT_ERROR' comprueba cuantas conexiones existen a la DB

        if (err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
        // si tengo un error 'ECONNREFUSED' cuando la conexión ha sido rechazada 
    }
    if(connection) connection.release();
    //si no tengo errores, conectamos la DB
    console.log('DB is connected');
    //lo comprobamos con un console.log
    return;
});

pool.query = promisify(pool.query);
// usa "promisify" para todas las peticiones de la conexión (y le pasamos el método "query" del módulo "pool")
// para cada consulta en la DB se puede utilizar "async await"

module.exports = pool;
// exportamos "pool" para las consultas 
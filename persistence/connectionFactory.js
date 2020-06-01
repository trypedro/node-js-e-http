const mysql = require('mysql')

createDBCConnection = () => {
    return mysql.createConnection({

        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'admin',
        database: 'payfast',
    });
}

module.exports = () => createDBCConnection;
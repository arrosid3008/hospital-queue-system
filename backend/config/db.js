const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',    
    password: '',      
    database: 'hospital_queue' 
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung dengan database!:', err.message);
    } else {
        console.log('Sukses!, berhasil terhubung ke MySQL hospital_queue!');
    }
});

module.exports = db;
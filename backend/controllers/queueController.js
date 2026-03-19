const db = require('../config/db');

const ambilAntrian = (req, res) => {
    const { nama_pasien, no_hp, poli_tujuan } = req.body;
    let prefix = 'U';
    if (poli_tujuan.toLowerCase() === 'gigi') prefix = 'G';
    if (poli_tujuan.toLowerCase() === 'anak') prefix = 'A';

    const queryCari = "SELECT kode_antrian FROM antrian_pasien WHERE poli_tujuan = ? ORDER BY id DESC LIMIT 1";
    
    db.query(queryCari, [poli_tujuan], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        let nomorBaru = 1;
        if (results.length > 0) {
            const nomorTerakhir = parseInt(results[0].kode_antrian.substring(1));
            nomorBaru = nomorTerakhir + 1;
        }

        const kodeAntrianBaru = prefix + String(nomorBaru).padStart(3, '0');
        const querySimpan = "INSERT INTO antrian_pasien (nama_pasien, no_hp, poli_tujuan, kode_antrian) VALUES (?, ?, ?, ?)";
        
        db.query(querySimpan, [nama_pasien, no_hp, poli_tujuan, kodeAntrianBaru], (err2, hasil) => {
            if (err2) return res.status(500).json({ error: err2.message });
            
            req.io.emit('queueUpdated', { pesan: 'Ada antrian baru masuk!' });

            res.json({
                pesan: "Antrian berhasil diambil!",
                kode_antrian: kodeAntrianBaru
            });
        });
    });
};

const getSemuaAntrian = (req, res) => {
    const query = "SELECT * FROM antrian_pasien ORDER BY id ASC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const panggilPasien = (req, res) => {
    const idPasien = req.params.id; 
    const query = "UPDATE antrian_pasien SET status = 'dipanggil' WHERE id = ?";
    db.query(query, [idPasien], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        req.io.emit('queueUpdated', { pesan: `Pasien dipanggil!` });

        res.json({ pesan: `Pasien dengan ID ${idPasien} sedang dipanggil!` });
    });
};

const selesaikanAntrian = (req, res) => {
    const idPasien = req.params.id;
    const query = "UPDATE antrian_pasien SET status = 'selesai' WHERE id = ?";
    db.query(query, [idPasien], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        req.io.emit('queueUpdated', { pesan: `Antrian selesai!` });

        res.json({ pesan: `Antrian ID ${idPasien} telah selesai!` });
    });
};

module.exports = { 
    ambilAntrian, 
    getSemuaAntrian, 
    panggilPasien, 
    selesaikanAntrian 
};
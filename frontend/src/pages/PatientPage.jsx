import { useState } from 'react';
import axios from 'axios';

export default function PatientPage() {
    const [formData, setFormData] = useState({
        nama_pasien: '',
        no_hp: '',
        poli_tujuan: 'Umum'
    });

    const [antrianBaru, setAntrianBaru] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await axios.post('http://localhost:5000/api/queue', formData);
            setAntrianBaru(response.data.kode_antrian);
            setFormData({ nama_pasien: '', no_hp: '', poli_tujuan: 'Umum' });
        } catch (error) {
            console.error("Ada kesalahan:", error);
            alert("Gagal mengambil antrian.");
        }
    };

    // Fungsi memanggil fitur Print di browser
    const handleCetak = () => {
        window.print(); 
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Rumah Sakit Kita</h2>
            <p>Silakan isi data diri Anda untuk mengambil nomor antrian.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="nama_pasien" placeholder="Nama Pasien" value={formData.nama_pasien} onChange={handleChange} required style={{ padding: '10px' }} />
                <input type="text" name="no_hp" placeholder="Nomor HP" value={formData.no_hp} onChange={handleChange} required style={{ padding: '10px' }} />
                <select name="poli_tujuan" value={formData.poli_tujuan} onChange={handleChange} style={{ padding: '10px' }}>
                    <option value="Umum">Poli Umum</option>
                    <option value="Gigi">Poli Gigi</option>
                    <option value="Anak">Poli Anak</option>
                </select>
                
                <button type="submit" style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    AMBIL ANTRIAN
                </button>
            </form>

            {/* CSS Ajaib untuk Print Karcis Saja */}
            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        #area-karcis, #area-karcis * { visibility: visible; }
                        #area-karcis { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
                        .tombol-cetak { display: none !important; }
                    }
                `}
            </style>

            {/* Kotak Hasil Karcis */}
            {antrianBaru && (
                <div id="area-karcis" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', textAlign: 'center', borderRadius: '8px', color: 'black' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Rumah Sakit Kita</h3>
                    <p style={{ margin: '0' }}>Nomor Antrian Anda:</p>
                    <h1 style={{ fontSize: '60px', margin: '10px 0' }}>{antrianBaru}</h1>
                    <p style={{ margin: '0' }}>Waktu Daftar: {new Date().toLocaleTimeString('id-ID')}</p>
                    
                    <button className="tombol-cetak" onClick={handleCetak} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px' }}>
                        🖨️ CETAK KARCIS
                    </button>
                </div>
            )}
        </div>
    );
}
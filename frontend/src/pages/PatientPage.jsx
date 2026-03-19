import { useState } from 'react';
import axios from 'axios';

export default function PatientPage() {
    // State untuk menyimpan data ketikan user
    const [formData, setFormData] = useState({
        nama_pasien: '',
        no_hp: '',
        poli_tujuan: 'Umum'
    });

    // State untuk menampilkan nomor antrian setelah sukses
    const [antrianBaru, setAntrianBaru] = useState(null);

    // Fungsi untuk menangani perubahan teks di dalam form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi saat tombol "Ambil Antrian" diklik
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah halaman me-refresh
        
        try {
            // Menembak API Backend kita!
            const response = await axios.post('http://localhost:5000/api/queue', formData);
            
            // Menyimpan nomor antrian dari backend ke state agar muncul di layar
            setAntrianBaru(response.data.kode_antrian);
            
            // Mengosongkan form kembali
            setFormData({ nama_pasien: '', no_hp: '', poli_tujuan: 'Umum' });
        } catch (error) {
            console.error("Ada kesalahan:", error);
            alert("Gagal mengambil antrian. Cek apakah server backend sudah menyala.");
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Kios Antrian Rumah Sakit</h2>
            <p>Silakan isi data diri Anda untuk mengambil nomor antrian.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    name="nama_pasien" 
                    placeholder="Nama Pasien" 
                    value={formData.nama_pasien} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="text" 
                    name="no_hp" 
                    placeholder="Nomor HP" 
                    value={formData.no_hp} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <select 
                    name="poli_tujuan" 
                    value={formData.poli_tujuan} 
                    onChange={handleChange}
                    style={{ padding: '10px' }}
                >
                    <option value="Umum">Poli Umum</option>
                    <option value="Gigi">Poli Gigi</option>
                    <option value="Anak">Poli Anak</option>
                </select>
                
                <button type="submit" style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    AMBIL ANTRIAN
                </button>
            </form>

            {/* Kotak ini hanya akan muncul kalau pendaftaran berhasil */}
            {antrianBaru && (
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', textAlign: 'center', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Pendaftaran Sukses!</h3>
                    <p style={{ margin: '0' }}>Nomor Antrian Anda:</p>
                    <h1 style={{ fontSize: '50px', margin: '10px 0', color: '#155724' }}>{antrianBaru}</h1>
                    <p style={{ margin: '0' }}>Silakan duduk dan tunggu panggilan.</p>
                </div>
            )}
        </div>
    );
}
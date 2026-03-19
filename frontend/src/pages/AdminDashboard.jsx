import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function AdminDashboard() {
    const [daftarAntrian, setDaftarAntrian] = useState([]);

    const fetchAntrian = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/queue');
            setDaftarAntrian(response.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };

    useEffect(() => {
        fetchAntrian(); 

        socket.on('queueUpdated', () => {
            fetchAntrian();
        });

        return () => {
            socket.off('queueUpdated');
        };
    }, []);

    const handlePanggil = async (id) => {
        await axios.put(`http://localhost:5000/api/queue/${id}/call`);
    };

    const handleSelesai = async (id) => {
        await axios.put(`http://localhost:5000/api/queue/${id}/done`);
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Dashboard Admin Ruang Tunggu</h2>
            
            <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px', borderColor: '#444' }}>
                <thead style={{ backgroundColor: '#333' }}>
                    <tr>
                        <th>No Antrian</th>
                        <th>Nama Pasien</th>
                        <th>Poli</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {daftarAntrian.map((pasien) => (
                        <tr key={pasien.id}>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', color: '#61dafb' }}>
                                {pasien.kode_antrian}
                            </td>
                            <td>{pasien.nama_pasien}</td>
                            <td>{pasien.poli_tujuan}</td>
                            <td>
                                <span style={{ 
                                    padding: '5px 10px', 
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    // background sesuai status
                                    backgroundColor: pasien.status === 'menunggu' ? '#ffc107' : pasien.status === 'dipanggil' ? '#17a2b8' : '#28a745',
                                    color: pasien.status === 'menunggu' ? 'black' : 'white'
                                }}>
                                    {pasien.status.toUpperCase()}
                                </span>
                            </td>
                            <td>
                                {pasien.status === 'menunggu' && (
                                    <button onClick={() => handlePanggil(pasien.id)} style={{ padding: '8px 12px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                                        Panggil Pasien
                                    </button>
                                )}
                                {pasien.status === 'dipanggil' && (
                                    <button onClick={() => handleSelesai(pasien.id)} style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                                        Selesai
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
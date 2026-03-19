import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function DisplayPage() {
    const [pasienDipanggil, setPasienDipanggil] = useState(null);
    const [sisaAntrian, setSisaAntrian] = useState([]);

    const fetchAntrian = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/queue');
            const semuaData = response.data;

            const sedangDipanggil = semuaData.find(p => p.status === 'dipanggil');
            setPasienDipanggil(sedangDipanggil || null);

            const menunggu = semuaData.filter(p => p.status === 'menunggu').slice(0, 5);
            setSisaAntrian(menunggu);

        } catch (error) {
            console.error("Gagal mengambil data display:", error);
        }
    };

    // Efek untuk mengambil data dan mendengarkan Socket.io
    useEffect(() => {
        fetchAntrian();

        socket.on('queueUpdated', () => {
            fetchAntrian();
        });

        return () => {
            socket.off('queueUpdated');
        };
    }, []);

    // Efek KHUSUS untuk memutar Suara AI saat pasien dipanggil
    useEffect(() => {
        if (pasienDipanggil) {
            // Memecah "U001" jadi "U 0 0 1" agar dieja dengan benar
            const ejaanNomor = pasienDipanggil.kode_antrian.split('').join(' ');
            const kalimat = `Nomor antrian, ${ejaanNomor}. Silakan menuju, Poli ${pasienDipanggil.poli_tujuan}`;
            
            const robotSuara = new SpeechSynthesisUtterance(kalimat);
            robotSuara.lang = 'id-ID'; // Logat Indonesia
            robotSuara.rate = 0.8; // Kecepatan bicara
            robotSuara.pitch = 1;

            window.speechSynthesis.speak(robotSuara);
        }
    }, [pasienDipanggil]);

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '40px', color: '#f39c12' }}>Layar Panggilan Antrian</h1>
            
            <div style={{ margin: '50px auto', padding: '40px', backgroundColor: '#222', borderRadius: '15px', border: '5px solid #f39c12', maxWidth: '600px' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '30px', color: '#aaa' }}>NOMOR ANTRIAN:</h2>
                {pasienDipanggil ? (
                    <>
                        <h1 style={{ fontSize: '120px', margin: '0 0 10px 0', color: '#61dafb' }}>{pasienDipanggil.kode_antrian}</h1>
                        <h2 style={{ fontSize: '40px', margin: '50px 0 0 0', color: '#4caf50', lineHeight: '1.2' }}>Menuju: Poli {pasienDipanggil.poli_tujuan}</h2>
                    </>
                ) : (
                    <h1 style={{ fontSize: '60px', margin: '0', color: '#555' }}>BELUM ADA</h1>
                )}
            </div>

            <div style={{ marginTop: '50px' }}>
                <h3 style={{ fontSize: '24px', color: '#aaa', borderBottom: '2px solid #333', display: 'inline-block', paddingBottom: '10px' }}>
                    Selanjutnya Bersiap-siap:
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {sisaAntrian.length > 0 ? (
                        sisaAntrian.map((pasien) => (
                            <div key={pasien.id} style={{ padding: '20px 40px', backgroundColor: '#333', borderRadius: '10px', fontSize: '30px', fontWeight: 'bold' }}>
                                {pasien.kode_antrian}
                            </div>
                        ))
                    ) : (
                        <p style={{ fontSize: '20px', color: '#666' }}>Tidak ada antrian menunggu.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
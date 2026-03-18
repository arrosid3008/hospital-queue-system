const express = require('express');
const http = require('http'); // Tambahan baru: Modul bawaan Node.js
const { Server } = require('socket.io'); // Tambahan baru: Memanggil Socket.io
const cors = require('cors');
require('./config/db'); 

const app = express();

// Membungkus aplikasi Express dengan HTTP Server
const server = http.createServer(app);

// Menempelkan Socket.io ke HTTP Server
const io = new Server(server, {
    cors: {
        origin: "*", // Mengizinkan frontend dari port mana saja (React/Vite) untuk terhubung
        methods: ["GET", "POST", "PUT"]
    }
});

app.use(cors());
app.use(express.json());

// Trik Senior: Menyisipkan 'io' ke dalam setiap request 
// Supaya nanti controller kita bisa pakai alat ini untuk "berteriak" ke frontend
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Jalur API kita
const queueRoutes = require('./routes/queueRoutes');
app.use('/api/queue', queueRoutes);

// Mendengarkan jika ada frontend yang menyambungkan "HT"-nya
io.on('connection', (socket) => {
    console.log('Mantap! Ada frontend yang terhubung ke Socket.io dengan ID:', socket.id);

    socket.on('disconnect', () => {
        console.log('Frontend terputus.');
    });
});

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server Backend & Socket.io menyala bersamaan di http://localhost:${PORT}`);
});
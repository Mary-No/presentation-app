import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/users';
import presentationRoutes from './routes/presentations';
import slideRoutes from './routes/slides';
import { setupSocket } from './sockets/socketHandler';
import { requestLogger } from './middleware/logger';


dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://mary-no.github.io'],
    credentials: true,
}));
app.use(express.json());
app.use(requestLogger);
app.use('/users', userRoutes);
app.use('/presentations', presentationRoutes);
app.use('/slides', slideRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://mary-no.github.io'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    }
});

setupSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

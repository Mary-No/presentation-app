import { io } from "socket.io-client";
import type { Roles } from "../app/types";

export const SOCKET_URL: string = 'http://localhost:4000/';
export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

export interface ClientData {
    nickname: string;
    role: Roles;
    presentationId: string;
}

export const connectToPresentation = (socket: any, data: ClientData) => {
    console.log('socket', socket);
    console.log('data', data);

    socket.emit('join', data);
};

export const emitCursorMove = (socket: any, x: number, y: number) => {
    console.log('socket', socket);
    console.log('x,y', x, y);
    socket.emit('cursor_move', { x, y });
};

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
    socket.emit('join', data);
};

export const emitCursorMove = (socket: any, x: number, y: number) => {
    socket.emit('cursor_move', { x, y });
};

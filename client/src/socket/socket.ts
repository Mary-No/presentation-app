import type { Roles } from "../app/types";

export const SOCKET_URL = 'https://presentation-app-6a87.onrender.com';

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

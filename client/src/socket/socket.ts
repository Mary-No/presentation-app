import { io } from "socket.io-client";
import type { Roles, Slide } from "../app/types";

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
export const emitSlideUpdate = (slideId: string, content: any) => {
    socket.emit('update_slide', { slideId, content });
};
export const emitSlideChange = (slideId: string) => {
    socket.emit('slide_change', { slideId });
};
export const emitAddSlide = (slide: Slide) => {
    socket.emit('add_slide', { slide });
};
export const emitRemoveSlide = (slideId: string) => {
    socket.emit('remove_slide', { slideId });
};
export const emitRoleChange = (targetSocketId: string, newRole: Roles) => {
    socket.emit('change_role', { targetSocketId, newRole });
};
export const disconnectSocket = () => {
    socket.disconnect();
};
export const offSocketEvent = (event: string) => {
    socket.off(event);
};
import { Server, Socket } from 'socket.io';

interface ClientData {
    nickname: string;
    role: 'creator' | 'editor' | 'viewer';
    presentationId: string;
}

const userRooms = new Map<string, ClientData>();

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('👤 Connected:', socket.id);

        socket.on('join', ({ presentationId, nickname, role }: ClientData) => {
            socket.join(presentationId);
            userRooms.set(socket.id, { nickname, role, presentationId });

            const usersInRoom = Array.from(userRooms.entries())
                .filter(([, data]) => data.presentationId === presentationId)
                .map(([id, data]) => ({ socketId: id, ...data }));

            io.to(presentationId).emit('user_joined', {
                users: usersInRoom,
            });
        });

        socket.on('cursor_move', ({ x, y }) => {
            const user = userRooms.get(socket.id);
            if (user) {
                socket.to(user.presentationId).emit('cursor_update', {
                    socketId: socket.id,
                    nickname: user.nickname,
                    x,
                    y,
                });
            }
        });

        socket.on('update_slide', ({ slideId, content }) => {
            const user = userRooms.get(socket.id);
            if (user && (user.role === 'creator' || user.role === 'editor')) {
                socket.to(user.presentationId).emit('slide_updated', {
                    slideId,
                    content,
                });
            }
        });

        socket.on('slide_change', ({ slideId }) => {
            const user = userRooms.get(socket.id);
            if (user) {
                io.to(user.presentationId).emit('slide_changed', {
                    slideId,
                });
            }
        });

        socket.on('add_slide', ({ slide }) => {
            const user = userRooms.get(socket.id);
            if (user?.role === 'creator') {
                io.to(user.presentationId).emit('slide_added', {
                    slide,
                });
            }
        });

        socket.on('remove_slide', ({ slideId }) => {
            const user = userRooms.get(socket.id);
            if (user?.role === 'creator') {
                io.to(user.presentationId).emit('slide_removed', {
                    slideId,
                });
            }
        });

        socket.on('change_role', ({ targetSocketId, newRole }) => {
            const user = userRooms.get(socket.id);
            const targetUser = userRooms.get(targetSocketId);

            if (user?.role === 'creator' && targetUser && targetUser.presentationId === user.presentationId) {
                targetUser.role = newRole;
                userRooms.set(targetSocketId, targetUser);

                io.to(user.presentationId).emit('role_changed', {
                    socketId: targetSocketId,
                    newRole,
                });
            }
        });

        socket.on('disconnect', () => {
            const user = userRooms.get(socket.id);
            if (user) {
                userRooms.delete(socket.id);
                io.to(user.presentationId).emit('user_left', {
                    socketId: socket.id,
                    nickname: user.nickname,
                });
            }
            console.log('❌ Disconnected:', socket.id);
        });
    });
};

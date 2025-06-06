import { useState, useEffect } from "react";
import type { Socket } from "socket.io-client";

type CursorData = { socketId: string; nickname: string; x: number; y: number };

export function useRemoteCursors(socket: Socket, usersInRoom: { socketId: string }[]) {
    const [remoteCursors, setRemoteCursors] = useState<Record<string, { nickname: string; x: number; y: number }>>({});

    useEffect(() => {
        const handler = (data: CursorData) => {
            setRemoteCursors(prev => ({
                ...prev,
                [data.socketId]: {
                    nickname: data.nickname,
                    x: data.x,
                    y: data.y,
                },
            }));
        };

        socket.on("cursor_update", handler);


        return () => {
            socket.off("cursor_update", handler);
        };
    }, [socket]);

    useEffect(() => {
        setRemoteCursors(prev => {
            const allowedIds = new Set(usersInRoom.map(u => u.socketId));
            const filtered = Object.fromEntries(
                Object.entries(prev).filter(([socketId]) => allowedIds.has(socketId))
            );
            return filtered;
        });
    }, [usersInRoom]);

    return remoteCursors;
}

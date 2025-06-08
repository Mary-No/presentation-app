import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import type { Roles } from "../app/types";
import {useAppDispatch} from "../app/hooks.ts";
import {addSlideToStore, removeSlideFromStore, updateSlideContent} from "../api/slidesSlice.ts";
import { store } from "../app/store.ts";
import { getEditorInstance } from "../app/editorInstance.ts";

type User = {
    socketId: string;
    nickname: string;
    role: Roles;
}

export const useSocketConnection = () => {
    const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        socket.connect();

        socket.on("connect", () => console.log("Connected"));
        socket.on("disconnect", () => console.log("Disconnected"));
        socket.on("connect_error", (error) => console.error("Socket error:", error));
        socket.on("user_joined", ({ users }) => setUsersInRoom(users));
        socket.on("role_changed", ({ socketId, newRole }) => {
            setUsersInRoom(prevUsers =>
                prevUsers.map(user =>
                    user.socketId === socketId ? { ...user, role: newRole } : user
                )
            );
        });
        socket.on("slide_added", ({ slide }) => {
            dispatch(addSlideToStore(slide));
        });
        socket.on("slide_removed", ({ slideId  }) => {
            dispatch(removeSlideFromStore(slideId ));
        });
        socket.on("slide_updated", ({ slideId, content }) => {
            const state = store.getState();
            const currentSlide = state.slides.slides.find(s => s.id === slideId);
            const currentIndex = state.slides.currentSlideIndex;

            store.dispatch(updateSlideContent({ id: slideId, content }));

            if (currentSlide?.slideIndex === currentIndex) {
                const editor = getEditorInstance();
                if (editor && content?.store && content?.schema) {
                    editor.store.loadSnapshot(content);
                }
            }
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("user_joined");
            socket.off("role_changed");
            socket.off("slide_added");
            socket.off("slide_removed");
            socket.off("slide_updated");
            socket.disconnect();
        };
    }, []);

    return { usersInRoom };
};

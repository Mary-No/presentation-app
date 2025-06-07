import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

export const useSocketConnection = () => {
    const [usersInRoom, setUsersInRoom] = useState([]);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => console.log("Connected"));
        socket.on("disconnect", () => console.log("Disconnected"));
        socket.on("connect_error", (error) => console.error("Socket error:", error));
        socket.on("user_joined", ({ users }) => setUsersInRoom(users));

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("user_joined");
            socket.disconnect();
        };
    }, []);

    return { usersInRoom };
};

import { useCallback } from "react";
import throttle from "lodash.throttle";
import { emitCursorMove, socket } from "../socket/socket";
import { useRemoteCursors } from "./useRemoteCursors";

export const useCursorSync = ({
                                  nickname,
                                  usersInRoom,
                              }: {
    nickname?: string;
    usersInRoom: any[];
}) => {
    const onMouseMove = useCallback(
        throttle((e: React.MouseEvent) => {
            if (nickname) {
                emitCursorMove(socket, e.clientX, e.clientY);
            }
        }, 50),
        [nickname]
    );

    const remoteCursors = useRemoteCursors(socket, usersInRoom);

    return { onMouseMove, remoteCursors };
};

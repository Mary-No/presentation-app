import { Slides } from "../../components/Slides.tsx";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks.ts";
import { useGetPresentationByIdQuery } from "../../api/presentationApi.ts";
import s from "./PresentationPage.module.scss";

import { useEffect, useCallback } from "react";
import { connectToPresentation, emitCursorMove, socket } from "../../socket/socket.ts";
import type { Roles, Role } from "../../app/types.ts";
import { RemoteCursor } from "../../components/RemoteCursor.tsx";
import { useRemoteCursors } from "../../hooks/useRemoteCursors.ts";

export const PresentationPage = () => {
    const { id } = useParams<{ id: string }>();
    const nickname = useAppSelector(state => state.user.nickname);

    const { data: presentation, refetch, isLoading, isError } = useGetPresentationByIdQuery(
        { id: id!, nickname },
        { skip: !id || !nickname }
    );

    const role: Roles | undefined = presentation?.roles.find((r: Role) =>
        r.userNickname.toLowerCase() === nickname.toLowerCase()
    )?.role;
    const owner = nickname === presentation?.ownerNickname;


    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            console.log("Connected");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });

        socket.on("connect_error", (error) => {
            console.error("Socket error:", error);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.disconnect();
        };
    }, [ socket]);

    useEffect(() => {
        if (presentation && nickname && role) {
            connectToPresentation(socket, {
                presentationId: presentation.id,
                nickname,
                role,
            });
        }
    }, [presentation, nickname, role, socket]);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if ( nickname) {
            emitCursorMove(socket, e.clientX, e.clientY);
        }
    }, [socket, nickname]);

    const remoteCursors = useRemoteCursors(socket);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !presentation) return <div>Error loading presentation</div>;

    return (
        <div onMouseMove={onMouseMove} style={{position: "relative"}}>
            <div  className={s.slidesContainer} >
                <Slides
                    slides={presentation.slides}
                    presentationId={presentation.id}
                    onSlideAdded={() => refetch()}
                    owner={owner}
                />
            </div>
            {Object.entries(remoteCursors).map(([socketId, cursor]) => (
                <RemoteCursor
                    key={socketId}
                    x={cursor.x}
                    y={cursor.y}
                    nickname={cursor.nickname}
                />
            ))}
        </div>

    )
}
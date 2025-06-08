import { Slides } from "../../components/Slides/Slides.tsx";
import { RemoteCursor } from "../../components/RemoteCursor.tsx";
import {UsersList} from "../../components/UsersList.tsx";
import {DrawBoard} from "../../components/DrawBoard/DrawBoard.tsx";
import { usePresentationInfo } from "../../hooks/usePresentationInfo";
import { useSocketConnection } from "../../hooks/useSocketConnection";
import { useJoinPresentation } from "../../hooks/useJoinPresentation";
import { useCursorSync } from "../../hooks/useCursorSync";
import s from "./PresentationPage.module.scss"
import {useEffect, useRef } from "react";
import { disconnectSocket } from "../../socket/socket.ts";
import { setEditorInstance } from "../../app/editorInstance.ts";


export const PresentationPage = () => {

    const { nickname, presentation, refetch, isLoading, isError } = usePresentationInfo();
    const editorRef = useRef<any>(null);
    const { usersInRoom } = useSocketConnection();
    const role = useJoinPresentation({ presentation, nickname });
    const owner = role === "creator";
    const { onMouseMove, remoteCursors } = useCursorSync({ nickname, usersInRoom });
    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !presentation) return <div>Error loading presentation</div>;

    return (
        <div onMouseMove={onMouseMove} style={{ display: "flex", position: "relative" }}>
            <div className={s.slidesContainer}>
                <Slides
                presentationId={presentation.id}
                onSlideAdded={refetch}
                owner={owner}
                getCurrentEditor={() => editorRef.current}
                />
            </div>
            <div className={s.drawTools}>
                <div className={s.presentationTitle}><h3>{presentation.title}</h3></div>
                <DrawBoard role={role} onEditorMount={(editor) => {
                    editorRef.current = editor;
                    setEditorInstance(editor);
                }} />
            </div>
            <UsersList presentationId={presentation.id} usersInRoom={usersInRoom} />
            {Object.entries(remoteCursors).map(([socketId, cursor]) => (
                <RemoteCursor key={socketId} {...cursor} />
            ))}
        </div>
    );
};

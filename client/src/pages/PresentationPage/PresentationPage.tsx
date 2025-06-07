import { Slides } from "../../components/Slides/Slides.tsx";
import { RemoteCursor } from "../../components/RemoteCursor.tsx";
import {UsersList} from "../../components/UsersList.tsx";
import {DrawBoard} from "../../components/DrawBoard/DrawBoard.tsx";
import { usePresentationInfo } from "../../hooks/usePresentationInfo";
import { useSocketConnection } from "../../hooks/useSocketConnection";
import { useJoinPresentation } from "../../hooks/useJoinPresentation";
import { useCursorSync } from "../../hooks/useCursorSync";
import s from "./PresentationPage.module.scss"


export const PresentationPage = () => {

    const { nickname, presentation, refetch, isLoading, isError } = usePresentationInfo();
    const { usersInRoom } = useSocketConnection();
    useJoinPresentation({ presentation, nickname });
    const owner = nickname === presentation?.ownerNickname;
    const { onMouseMove, remoteCursors } = useCursorSync({ nickname, usersInRoom });



    if (isLoading) return <div>Loading...</div>;
    if (isError || !presentation) return <div>Error loading presentation</div>;

    return (
        <div onMouseMove={onMouseMove} style={{ display: "flex", position: "relative" }}>
            <div className={s.slidesContainer}>
                <Slides
                presentationId={presentation.id}
                onSlideAdded={refetch}
                owner={owner}/>
            </div>
            <div className={s.drawTools}>
                <div className={s.presentationTitle}><h3>{presentation.title}</h3></div>
                <DrawBoard />
            </div>
            <UsersList usersInRoom={usersInRoom} />
            {Object.entries(remoteCursors).map(([socketId, cursor]) => (
                <RemoteCursor key={socketId} {...cursor} />
            ))}
        </div>
    );
};

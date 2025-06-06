import { Slides } from "../../components/Slides.tsx";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks.ts";
import { useGetPresentationByIdQuery } from "../../api/presentationApi.ts";
import s from "./PresentationPage.module.scss";

export const PresentationPage = () => {
    const { id } = useParams<{ id: string }>();
    const nickname = useAppSelector(state => state.user.nickname);

    const { data: presentation, refetch, isLoading, isError } = useGetPresentationByIdQuery(
        { id: id, nickname: nickname },
        { skip: !id || !nickname }
    );

    let owner = false
    if (!isLoading && presentation) {
        owner = !!nickname && nickname === presentation.ownerNickname;
    }
    if (isLoading) return <div>Loading...</div>;
    if (isError || !presentation) return <div>Error loading presentation</div>;

    return (
        <div>
            <div className={s.slidesContainer}>
                <Slides
                    slides={presentation.slides}
                    presentationId={presentation.id}
                    onSlideAdded={() => refetch()}
                    owner={owner}
                />
            </div>
        </div>
    );
};

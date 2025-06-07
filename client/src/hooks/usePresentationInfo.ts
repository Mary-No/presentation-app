import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useGetPresentationByIdQuery } from "../api/presentationApi";
import { setSlides } from "../api/slidesSlice";
import { useEffect } from "react";

export const usePresentationInfo = () => {
    const { id } = useParams<{ id: string }>();
    const nickname = useAppSelector((state) => state.user.nickname);
    const dispatch = useAppDispatch();

    const { data: presentation, refetch, isLoading, isError } = useGetPresentationByIdQuery(
        { id: id!, nickname },
        { skip: !id || !nickname }
    );

    useEffect(() => {
        if (presentation?.slides) {
            dispatch(setSlides(presentation.slides));
        }
    }, [presentation?.slides, dispatch]);

    return { id, nickname, presentation, refetch, isLoading, isError };
};
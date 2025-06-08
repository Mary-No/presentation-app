import { useState, useEffect } from "react";
import isEqual from "lodash.isequal";

import type {Slide} from "../app/types.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import { useAddSlideMutation, useDeleteSlideMutation, useUpdateSlideMutation } from "../api/slidesApi.ts";
import { emitAddSlide, emitRemoveSlide, emitSlideUpdate } from "../socket/socket.ts";
import {removeSlideFromStore, setCurrentSlideIndex, updateSlideContent } from "../api/slidesSlice.ts";

export const useSlidesLogic = ({
                                   presentationId,
                                   getCurrentEditor,
                                   onSlideAdded,
                               }: {
    presentationId: string;
    getCurrentEditor: () => any;
    onSlideAdded: () => void;
}) => {
    const slides = useAppSelector((state) => state.slides.slides);
    const currentSlideIndex = useAppSelector((state) => state.slides.currentSlideIndex);
    const nickname = useAppSelector((state) => state.user.nickname);
    const dispatch = useAppDispatch();

    const [addSlide, { isLoading }] = useAddSlideMutation();
    const [deleteSlide] = useDeleteSlideMutation();
    const [updateSlide] = useUpdateSlideMutation();

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleAddSlide = async () => {
        try {
            if (!nickname) {
                setError("User is not logged in");
                return;
            }
            const currentSlide = slides.find((s:Slide) => s.slideIndex === currentSlideIndex);
            const newSlide = await addSlide({ presentationId, nickname }).unwrap();
            emitAddSlide(newSlide);

            if (currentSlide) {
                const editor = getCurrentEditor();
                const currentSnapshot = editor?.store?.getSnapshot();
                if (currentSnapshot) {
                    await updateSlide({
                        presentationId,
                        id: currentSlide.id,
                        nickname,
                        content: currentSnapshot,
                    }).unwrap();
                    dispatch(updateSlideContent({ id: currentSlide.id, content: currentSnapshot }));
                    emitSlideUpdate(currentSlide.id, currentSnapshot);
                }
            }

            const editor = getCurrentEditor();
            if (editor) {
                const emptySnapshot = editor.store.getSnapshot();
                emptySnapshot.store = {};
                editor.store.loadSnapshot(emptySnapshot);
            }

            dispatch(setCurrentSlideIndex(newSlide.slideIndex));
            setSuccessMsg(`Slide ${slides.length + 1} was added`);
            setError(null);
            onSlideAdded();
        } catch (e) {
            const err = e as { status?: number; data?: { error?: string } };
            const errorMessage = err.data?.error || "Error adding slide";
            setError(errorMessage);
            setSuccessMsg(null);
        }
    };

    const handleDeleteSlide = async (id: string) => {
        try {
            const slideToDelete = slides.find((s:Slide) => s.id === id);
            await deleteSlide({ id, nickname }).unwrap();
            dispatch(removeSlideFromStore(id));
            emitRemoveSlide(id);

            if (slideToDelete?.slideIndex === currentSlideIndex) {
                const newIndex = Math.max(0, currentSlideIndex - 1);
                dispatch(setCurrentSlideIndex(newIndex));
                await handleSelectSlide(newIndex);
            }
            setSuccessMsg("Slide deleted successfully");
        } catch (err: any) {
            const errorMessage = err?.data?.error || "Failed to delete slide";
            setError(errorMessage);
        }
    };

    const handleSelectSlide = async (index: number) => {
        const editor = getCurrentEditor();
        if (!editor || !editor.store) {
            setError("Editor is not ready");
            return;
        }

        const newSlide = slides.find((s:Slide) => s.slideIndex === index);
        if (!newSlide) {
            setError("Slide not found");
            return;
        }

        try {
            if (currentSlideIndex !== index) {
                const currentSlide = slides.find((s:Slide) => s.slideIndex === currentSlideIndex);
                if (currentSlide) {
                    const currentSnapshot = editor.store.getSnapshot();
                    if (!isEqual(currentSnapshot, currentSlide.content)) {
                        await updateSlide({ presentationId, id: currentSlide.id, nickname, content: currentSnapshot }).unwrap();
                        dispatch(updateSlideContent({ id: currentSlide.id, content: currentSnapshot }));
                        emitSlideUpdate(currentSlide.id, currentSnapshot);
                    }
                }
            }
            if (newSlide.content && newSlide.content.store && newSlide.content.schema) {
                editor.loadSnapshot(newSlide.content);
            }

            dispatch(setCurrentSlideIndex(index));
            setError(null);
        } catch (error) {
            setError("Failed to switch slide: " + (error as Error).message);
        }
    };

    const handleSaveSlide = async () => {
        const editor = getCurrentEditor();
        if (!editor || !editor.store) {
            setError("Editor is not ready");
            return;
        }

        const currentSlide = slides.find((s:Slide) => s.slideIndex === currentSlideIndex);
        if (!currentSlide) {
            setError("Current slide not found");
            return;
        }

        try {
            const currentSnapshot = editor.store.getSnapshot();

            if (!isEqual(currentSnapshot, currentSlide.content)) {
                await updateSlide({
                    presentationId,
                    id: currentSlide.id,
                    nickname,
                    content: currentSnapshot,
                }).unwrap();

                dispatch(updateSlideContent({ id: currentSlide.id, content: currentSnapshot }));
                emitSlideUpdate(currentSlide.id, currentSnapshot);
                setSuccessMsg("Slide saved successfully");
            } else {
                setSuccessMsg("No changes to save");
            }
            setError(null);
        } catch (error) {
            setError("Failed to save slide: " + (error as Error).message);
        }
    };

    useEffect(() => {
        const editor = getCurrentEditor();
        if (slides.length > 0 && editor && editor.store && currentSlideIndex === 0) {
            handleSelectSlide(0);
        }
    }, [slides, getCurrentEditor]);

    return {
        slides,
        currentSlideIndex,
        error,
        successMsg,
        isLoading,
        handleAddSlide,
        handleDeleteSlide,
        handleSelectSlide,
        handleSaveSlide,
    };
};

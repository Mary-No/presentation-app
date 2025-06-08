import { Alert, Button, Typography } from "antd";
import {useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks.ts";
import Title from "antd/lib/typography/Title";
import { CloseOutlined } from "@ant-design/icons";
import {useAddSlideMutation, useDeleteSlideMutation, useUpdateSlideMutation} from "../../api/slidesApi.ts";
import {addSlideToStore, removeSlideFromStore, setCurrentSlideIndex, updateSlideContent} from "../../api/slidesSlice.ts";
import s from './Slides.module.scss'
import isEqual from "lodash.isequal";

const { Text } = Typography;

type SlidesProps = {
    presentationId: string;
    onSlideAdded: () => void;
    owner: boolean;
    getCurrentEditor: () => any;
};

export const Slides = ({ presentationId, onSlideAdded, owner, getCurrentEditor }: SlidesProps) => {
    const slides = useAppSelector((state) => state.slides.slides);
    const currentSlideIndex = useAppSelector((state) => state.slides.currentSlideIndex);
    const [addSlide, { isLoading }] = useAddSlideMutation();
    const [deleteSlide] = useDeleteSlideMutation();
    const [updateSlide] = useUpdateSlideMutation()
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const nickname = useAppSelector((state) => state.user.nickname);
    const dispatch = useAppDispatch();

    const handleClick = async () => {
        try {
            if (!nickname) {
                setError("User is not logged in");
                return;
            }

            // Сохраняем текущий слайд
            const currentSlide = slides.find(s => s.slideIndex === currentSlideIndex);
            if (currentSlide) {
                const editor = getCurrentEditor();
                const currentSnapshot = editor?.store?.getSnapshot();
                if (currentSnapshot) {
                    await updateSlide({
                        presentationId,
                        id: currentSlide.id,
                        nickname,
                        content: currentSnapshot
                    }).unwrap();
                    dispatch(updateSlideContent({
                        id: currentSlide.id,
                        content: currentSnapshot
                    }));
                }
            }

            // Добавляем новый слайд
            const newSlide = await addSlide({ presentationId, nickname }).unwrap();
            dispatch(addSlideToStore(newSlide));

            // Правильно сбрасываем редактор для нового слайда
            const editor = getCurrentEditor();
            if (editor) {
                // Получаем чистый снапшот из редактора
                const emptySnapshot = editor.store.getSnapshot();
                // Очищаем все фигуры
                emptySnapshot.store = {};
                // Применяем очищенный снапшот
                editor.store.loadSnapshot(emptySnapshot);
            }

            // Устанавливаем новый слайд как текущий
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

    const handleDelete = async (id: string) => {
        try {
            await deleteSlide({ id, nickname }).unwrap();
            dispatch(removeSlideFromStore(id));
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

        const newSlide = slides.find((s) => s.slideIndex === index);
        if (!newSlide) {
            setError("Slide not found");
            return;
        }

        try {
            if (currentSlideIndex !== index) {

                const currentSlide = slides.find((s) => s.slideIndex === currentSlideIndex);
                if (currentSlide) {
                    const currentSnapshot = editor.store.getSnapshot();
                    if (!isEqual(currentSnapshot, currentSlide.content)) {
                        await updateSlide({ presentationId, id: currentSlide.id, nickname, content: currentSnapshot }).unwrap();
                        dispatch(updateSlideContent({ id: currentSlide.id, content: currentSnapshot }));
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
    useEffect(() => {
        const editor = getCurrentEditor();
        if (slides.length > 0 && editor && editor.store && currentSlideIndex === 0) {
            handleSelectSlide(0);
        }
    }, [slides, getCurrentEditor]);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #f0f0f0",
            }}
        >
            {owner && (
                <div style={{ padding: "1rem", borderBottom: "1px solid #f0f0f0" }}>
                    <Button
                        color="cyan"
                        variant="solid"
                        onClick={handleClick}
                        block
                        loading={isLoading}
                    >
                        Add Slide
                    </Button>
                </div>
            )}

            {error && <Alert message={error} type="error" showIcon />}
            {successMsg && <Alert message={successMsg} type="success" showIcon />}

            <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
                {slides.length === 0 ? (
                    <Title style={{ textAlign: "center" }} type="secondary" level={4}>
                        No slides yet
                    </Title>
                ) : (
                    slides.map((slide) => (
                        <div
                            onClick={() => handleSelectSlide(slide.slideIndex)}
                            key={slide.id}
                            className={slide.slideIndex===currentSlideIndex ? s.activeSlide: ""}
                            style={{
                                padding: "1rem",
                                marginBottom: "1rem",
                                border: "1px solid #d9d9d9",
                                borderRadius: 4,
                                background: "#fafafa",
                                display: "flex",
                                justifyContent: "space-between",
                                position: "relative",
                            }}
                        >
                            <Text strong>Slide {slide.slideIndex + 1}</Text>
                            <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(slide.id);
                                }}
                                style={{
                                    position: "absolute",
                                    top: 14,
                                    right: 8,
                                    zIndex: 10,
                                    color: "#999",
                                }}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

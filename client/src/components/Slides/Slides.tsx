import { Alert, Button, Typography } from "antd";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks.ts";
import Title from "antd/lib/typography/Title";
import { CloseOutlined } from "@ant-design/icons";
import {useAddSlideMutation, useDeleteSlideMutation} from "../../api/slidesApi.ts";
import {addSlideToStore, removeSlideFromStore, setCurrentSlideIndex} from "../../api/slidesSlice.ts";
import s from './Slides.module.scss'

const { Text } = Typography;

type SlidesProps = {
    presentationId: string;
    onSlideAdded: () => void;
    owner: boolean;
};

export const Slides = ({ presentationId, onSlideAdded, owner }: SlidesProps) => {
    const slides = useAppSelector((state) => state.slides.slides);
    console.log(slides)
    const currentSlideIndex = useAppSelector((state) => state.slides.currentSlideIndex);
    console.log(currentSlideIndex);
    const [addSlide, { isLoading }] = useAddSlideMutation();
    const [deleteSlide] = useDeleteSlideMutation();
    // const [updateSlide, { isLoading, isError, isSuccess, error }] = useUpdateSlideMutation()
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
            const newSlide = await addSlide({ presentationId, nickname }).unwrap();
            dispatch(addSlideToStore(newSlide));
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
    const handleSelectSlide = (index: number) => {
        // dispatch(updateSlideContent({ id: , content:  }))
        dispatch(setCurrentSlideIndex(index))
    }
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

import { Alert, Button, Typography } from "antd";
import { useAddSlideMutation } from "../api/sliceApi.ts";
import { useState } from "react";
import type {Slide} from "../app/types.ts";
import {useAppSelector} from "../app/hooks.ts";
import Title from "antd/lib/typography/Title";

const { Text } = Typography;

type SlidesProps = {
    slides: Slide[];
    presentationId: string;
    onSlideAdded: () => void;
    owner: boolean
};

export const Slides = ({ slides, presentationId, onSlideAdded, owner }: SlidesProps) => {
    const [addSlide, { isLoading }] = useAddSlideMutation();
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const nickname = useAppSelector((state) => state.user.nickname)

    const handleClick = async () => {
        try {
            if (!nickname) {
                setError("User is not logged in");
                return;
            }
            await addSlide({ presentationId, nickname }).unwrap();
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

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #f0f0f0",
            }}
        >
            {owner && <div style={{padding: "1rem", borderBottom: "1px solid #f0f0f0"}}>
                <Button color="cyan" variant="solid" onClick={handleClick} block loading={isLoading}>
                    Add Slide
                </Button>
            </div>}

            {error && <Alert message={error} type="error" showIcon/>}
            {successMsg && <Alert message={successMsg} type="success" showIcon/>}

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "1rem",
                }}
            >
                {slides.length === 0 ? (
                    <Title style={{textAlign: 'center'}} type="secondary" level={4}>No slides yet</Title>
                ) : (
                    slides.map((slide) => (
                        <div
                            key={slide.id}
                            style={{
                                padding: "1rem",
                                marginBottom: "1rem",
                                border: "1px solid #d9d9d9",
                                borderRadius: 4,
                                background: "#fafafa",
                            }}
                        >
                            <Text strong>Slide {slide.slideIndex + 1}</Text>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

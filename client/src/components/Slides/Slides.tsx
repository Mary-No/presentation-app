import { Alert, Button } from "antd";
import Title from "antd/lib/typography/Title";
import { useSlidesLogic } from "../../hooks/useSlidesLogic";
import { SlideItem } from "./SlideItem";


type SlidesProps = {
    presentationId: string;
    onSlideAdded: () => void;
    owner: boolean;
    getCurrentEditor: () => any;
};

export const Slides = ({ presentationId, onSlideAdded, owner, getCurrentEditor }: SlidesProps) => {
    const {
        slides,
        currentSlideIndex,
        error,
        successMsg,
        isLoading,
        handleAddSlide,
        handleDeleteSlide,
        handleSelectSlide,
        handleSaveSlide
    } = useSlidesLogic({ presentationId, getCurrentEditor, onSlideAdded });

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
                <div
                    style={{
                        padding: "1rem",
                        borderBottom: "1px solid #f0f0f0",
                        display: "flex",
                        gap: "0.5rem",
                        flexDirection: "column",
                    }}
                >
                    <Button color="blue" variant="solid" onClick={handleSaveSlide} block>
                        Save Slide
                    </Button>

                    <Button color="cyan" variant="solid" onClick={handleAddSlide} block loading={isLoading}>
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
                    slides
                        .slice()
                        .sort((a, b) => a.slideIndex - b.slideIndex)
                        .map((slide) => (
                            <SlideItem
                                key={slide.id}
                                slide={slide}
                                owner={owner}
                                currentSlideIndex={currentSlideIndex}
                                onSelect={handleSelectSlide}
                                onDelete={handleDeleteSlide}
                            />
                        ))
                )}
            </div>
        </div>
    );
};

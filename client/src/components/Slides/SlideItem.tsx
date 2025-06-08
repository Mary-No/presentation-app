import { Button, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import s from "./Slides.module.scss";

const { Text } = Typography;

type SlideItemProps = {
    slide: { id: string; slideIndex: number };
    currentSlideIndex: number;
    owner: boolean;
    onSelect: (index: number) => void;
    onDelete: (id: string) => void;
};

export const SlideItem = ({ slide, currentSlideIndex, owner, onSelect, onDelete }: SlideItemProps) => {
    return (
        <div
            onClick={() => onSelect(slide.slideIndex)}
            className={slide.slideIndex === currentSlideIndex ? s.activeSlide : ""}
            style={{
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
                background: "#fafafa",
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                pointerEvents: !owner ? "none" : "auto",
                opacity: !owner ? 0.5 : 1,
                cursor: "pointer",
            }}
        >
            <Text strong>Slide {slide.slideIndex + 1}</Text>
            {owner && (
                <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(slide.id);
                    }}
                    style={{
                        position: "absolute",
                        top: 14,
                        right: 8,
                        zIndex: 10,
                        color: "#999",
                    }}
                />
            )}
        </div>
    );
};

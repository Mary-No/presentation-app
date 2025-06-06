import Paragraph from "antd/lib/typography/Paragraph";
import type {Presentation} from "../app/types.ts";
import {Button, Card, Col, Row} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

type Props = {
    presentations: Presentation[];
    type?: 'my';
};


export const PresentationGallery = ({ presentations, type }: Props) => {
    const navigate = useNavigate();
    const onCardClick= async (presentation:Presentation)=>{
        try {
            navigate(`/presentations/${presentation.id}`);
        } catch (err) {
            console.error('Failed to loading presentation', err);
        }
    }
    return (
        <Row gutter={[16, 16]}>
            {presentations.map((p) => (
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                    <div style={{ position: "relative" }}>
                        <Card
                            title={p.title}
                            bordered={false}
                            hoverable
                            style={{
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                borderRadius: 12,
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                cursor: "pointer",
                            }}
                            bodyStyle={{ padding: "16px" }}
                            onClick={() => onCardClick(p)}
                            onMouseEnter={(e) => {
                                const card = e.currentTarget;
                                card.style.transform = "translateY(-4px)";
                                card.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                const card = e.currentTarget;
                                card.style.transform = "translateY(0)";
                                card.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            {type !== "my" && <Paragraph>Author: {p.ownerNickname}</Paragraph>}
                            <Paragraph type="secondary">
                                Created: {new Date(p.createdAt).toLocaleString()}
                            </Paragraph>
                        </Card>

                        <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();

                            }}
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 10,
                                color: "#999",
                            }}
                        />
                    </div>
                </Col>
            ))}
        </Row>
    );
};

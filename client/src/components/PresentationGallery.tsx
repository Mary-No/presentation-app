import Paragraph from "antd/lib/typography/Paragraph";
import type { Presentation } from "../app/types.ts";
import { Button, List, message, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDeletePresentationMutation } from "../api/presentationApi.ts";
import { useAppSelector } from "../app/hooks.ts";

const { Text } = Typography;

type Props = {
    presentations: Presentation[];
    type?: "my";
};

export const PresentationGallery = ({ presentations, type }: Props) => {
    const navigate = useNavigate();
    const [deletePresentation] = useDeletePresentationMutation();
    const nickname = useAppSelector((state) => state.user.nickname);

    const handleDelete = async (id: string) => {
        try {
            await deletePresentation({ id, nickname }).unwrap();
            message.success("Presentation deleted successfully");
        } catch (err: any) {
            const errorMessage = err?.data?.error || "Failed to delete presentation";
            message.error(errorMessage);
        }
    };

    const onItemClick = (presentation: Presentation) => {
        navigate(`/presentations/${presentation.id}`);
    };

    return (
        <List
            itemLayout="horizontal"
            dataSource={presentations}
            renderItem={(p) => (
                <List.Item
                    onClick={() => onItemClick(p)}
                    style={{
                        padding: "12px 16px",
                        border: "1px solid #f0f0f0",
                        borderRadius: 8,
                        marginTop: 40,
                        marginBottom: 12,
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    actions={
                        type === "my"
                            ? [
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(p.id);
                                    }}
                                    key="delete"
                                />,
                            ]
                            : []
                    }
                >
                    <List.Item.Meta
                        title={<Text style={{ fontSize: "1.1rem"}} strong>{p.title}</Text>}
                        description={
                            <>
                                {type !== "my" && (
                                    <Paragraph style={{ margin: 0 }}>Author: {p.ownerNickname}</Paragraph>
                                )}
                                <Paragraph style={{ margin: 0 }} type="secondary">
                                    Created: {new Date(p.createdAt).toLocaleString()}
                                </Paragraph>
                            </>
                        }
                    />
                </List.Item>
            )}
        />
    );
};

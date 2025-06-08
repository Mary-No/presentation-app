import { List, Typography, Button } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { Roles } from "../app/types";
import { useAppSelector } from "../app/hooks.ts";
import { useUpdateUserRoleMutation } from "../api/presentationApi";
import { emitRoleChange } from "../socket/socket.ts";

type User = {
    socketId: string;
    nickname: string;
    role: Roles;
};

type UsersListProps = {
    usersInRoom: User[];
    presentationId: string;
};

export function UsersList({ usersInRoom, presentationId }: UsersListProps) {
    const currentNickname = useAppSelector((state) => state.user.nickname);
    const currentUser = usersInRoom.find((user) => user.nickname === currentNickname);
    const isCurrentUserCreator = currentUser?.role === "creator";

    const [updateUserRole] = useUpdateUserRoleMutation();

    const handleChangeRole = (targetNickname: string, currentRole: Roles, direction: "up" | "down") => {
        // Находим целевого пользователя
        const targetUser = usersInRoom.find(user => user.nickname === targetNickname);

        if (!currentUser || !targetUser) {
            console.error("User not found");
            return;
        }

        let newRole: Roles | null = null;

        if (direction === "up") {
            if (currentRole === "viewer") newRole = "editor";
            else if (currentRole === "editor") newRole = "creator";
        } else {
            if (currentRole === "editor") newRole = "viewer";
        }

        if (!newRole) return;

        updateUserRole({
            id: presentationId,
            nickname: targetNickname,
            newRole,
            requestedBy: currentNickname,
        });

        emitRoleChange(targetUser.socketId, newRole);
    };

    return (
        <aside
            style={{
                width: "18vw",
                borderLeft: "1px solid #f0f0f0",
                padding: 12,
                overflowY: "auto",
                height: "100vh",
                backgroundColor: "#fafafa",
            }}
        >
            <Typography.Title level={5} style={{ marginBottom: 12 }}>
                Users in Room
            </Typography.Title>
            <List
                dataSource={usersInRoom}
                renderItem={(user) => {
                    const isSelf = user.nickname === currentNickname;

                    const actions =
                        isCurrentUserCreator && !isSelf
                            ? user.role === "viewer"
                                ? [
                                    <Button
                                        color="cyan"
                                        variant="solid"
                                        icon={<ArrowUpOutlined />}
                                        key="promote-viewer"
                                        onClick={() => handleChangeRole(user.nickname, user.role, "up")}
                                    />,
                                ]
                                : user.role === "editor"
                                    ? [
                                        <Button
                                            color="cyan"
                                            variant="solid"
                                            icon={<ArrowUpOutlined />}
                                            key="promote-editor"
                                            onClick={() => handleChangeRole(user.nickname, user.role, "up")}
                                        />,
                                        <Button
                                            color="cyan"
                                            variant="solid"
                                            icon={<ArrowDownOutlined />}
                                            key="demote-editor"
                                            onClick={() => handleChangeRole(user.nickname, user.role, "down")}
                                        />,
                                    ]
                                    : undefined
                            : undefined;

                    return (
                        <List.Item key={user.socketId} actions={actions}>
                            <List.Item.Meta
                                title={user.nickname}
                                description={
                                    <Typography.Text type="secondary">{user.role}</Typography.Text>
                                }
                            />
                        </List.Item>
                    );
                }}
            />
        </aside>
    );
}
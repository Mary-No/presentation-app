import { List, Typography } from "antd";
import type { Roles } from "../app/types";

type User = {
    socketId: string;
    nickname: string;
    role: Roles;
};

type UsersListProps = {
    usersInRoom: User[];
};

export function UsersList({ usersInRoom }: UsersListProps) {
    return (
        <aside
            style={{
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
                renderItem={(user) => (
                    <List.Item key={user.socketId}>
                        <List.Item.Meta
                            title={user.nickname}
                            description={<Typography.Text type="secondary">{user.role}</Typography.Text>}
                        />
                    </List.Item>
                )}
            />
        </aside>
    );
}

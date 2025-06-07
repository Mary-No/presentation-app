import React from "react";

type RemoteCursorProps = {
    x: number;
    y: number;
    nickname: string;
};

export const RemoteCursor: React.FC<RemoteCursorProps> = ({ x, y, nickname }) => {
    return (
        <div
            style={{
                position: "absolute",
                top: y,
                left: x,
                pointerEvents: "none",
                backgroundColor: "rgba(0, 150, 255, 0.7)",
                borderRadius: "50%",
                width: 10,
                height: 10,
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
            }}
            title={nickname}
        />
    );
};

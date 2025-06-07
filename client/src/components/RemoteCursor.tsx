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
                pointerEvents: "none",
                top: y,
                left: x,
                backgroundColor: "#007a70",
                borderRadius: "50%",
                width: 10,
                height: 10,
                transform: "translate(-50%, -50%)",
                zIndex: 1000,

            }}
        ><p>{nickname}</p></div>

    );
};

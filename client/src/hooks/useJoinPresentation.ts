import { useEffect } from "react";
import { connectToPresentation, socket } from "../socket/socket";
import type { Roles, Role } from "../app/types";

export const useJoinPresentation = ({
                                        presentation,
                                        nickname,
                                    }: {
    presentation?: { id: string; roles: Role[] };
    nickname?: string;
}) => {
    const role: Roles | undefined = presentation?.roles.find(
        (r) => r.userNickname.toLowerCase() === nickname?.toLowerCase()
    )?.role;

    useEffect(() => {
        if (presentation && nickname && role) {
            connectToPresentation(socket, {
                presentationId: presentation.id,
                nickname,
                role,
            });
        }
    }, [presentation, nickname, role]);

    return role;
};

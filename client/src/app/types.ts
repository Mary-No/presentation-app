export type Presentation = {
    id: string;
    title: string;
    ownerNickname: string;
    createdAt: string;
    slides?: Slide[];
    roles?: Role[]
};


export type Slide = {
    id: string;
    presentationId: string;
    slideIndex: number;
    content: any;
}

export type Role = {
    presentationId: string,
    userNickname: string,
    role: Roles
}

export type Roles = "creator" | "viewer" | "editor"
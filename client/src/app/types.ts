export type Presentation = {
    id: string;
    title: string;
    ownerNickname: string;
    createdAt: string;
    slides?: Slide[];
    roles?: Roles
};

export type Slide = {
    id: string;
    presentationId: string;
    slideIndex: number;
    content: string;
}

export type Roles = "creator" | "viewer" | "editor"
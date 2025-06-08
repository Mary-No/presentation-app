let editorInstance: any = null;

export const setEditorInstance = (editor: any) => {
    editorInstance = editor;
};

export const getEditorInstance = () => editorInstance;
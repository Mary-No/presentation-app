import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import type { Roles } from "../../app/types.ts";

type Props = {
    role: Roles | undefined;
    onEditorMount: (editor: any) => void; // new
};

export const DrawBoard = ({ role, onEditorMount }: Props) => {
    const isViewer = role === 'viewer';

    return (
        <div style={{ height: '100vh' }}>
            <div className="tldraw__editor" style={{ height: '100%' }}>
                <Tldraw
                    onMount={(editor) => {
                        if (isViewer) {
                            editor.updateInstanceState({ isReadonly: true });
                        }
                        onEditorMount(editor);
                    }}
                />
            </div>
        </div>
    );
};

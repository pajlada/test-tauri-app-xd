import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect } from "react";

export default function FileSelector({ onFileChosen }: { onFileChosen: (file_path: string) => void }) {
    console.log("FILE SELECTOR");

    useEffect(() => {
        console.log("FILE SELECTOR EFFECT");
        const appWebview = getCurrentWebviewWindow();
        const unlisten = appWebview.listen<string>('file_chosen', (event) => {
            console.log("wow someone emitted file chosen!", event);
            onFileChosen(event.payload);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);

    async function fileSelectorClicked() {
        console.log("file selector clicked!");
        await invoke("select_file");
    };
    return (
        <button onClick={fileSelectorClicked}>FILE SELECTOR</button>
    )
}

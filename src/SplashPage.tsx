import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { ChosenFileContext, ChosenFileContextType } from "./ChosenFileContext"
import { useContext, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function SplashPage() {
    const { setChosenFile } = useContext(ChosenFileContext) as ChosenFileContextType;

    useEffect(() => {
        console.log("FILE SELECTOR EFFECT");
        const appWebview = getCurrentWebviewWindow();
        const unlisten = appWebview.listen<string>('file_chosen', (event) => {
            console.log("wow someone emitted file chosen!", event);
            setChosenFile(event.payload);
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
        <>
            <button onClick={fileSelectorClicked}>FILE SELECTOR</button>
            <p>sPLASH</p>
        </>
    )
}

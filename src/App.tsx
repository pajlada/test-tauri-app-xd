import { useContext, useEffect } from "react";
import "./App.css";
import { ChosenFileContext, ChosenFileContextType } from "./ChosenFileContext";
import TwitchLogin from "./TwitchLogin";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export default function App() {
    const { chosenFile, setChosenFile } = useContext(ChosenFileContext) as ChosenFileContextType;

    useEffect(() => {
        console.log("visit effect");
        const appWebview = getCurrentWebviewWindow();
        const unlisten = appWebview.listen<string>('visit', (event) => {
            console.log("wow someone visited our web server", event);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);

    useEffect(() => {
        console.log("token effect");
        const appWebview = getCurrentWebviewWindow();
        const unlisten = appWebview.listen<string>('got_token', (event) => {
            console.log("thx for token", event);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);

    return (
        <>
            <p>wow chosen file is "{chosenFile}"</p>
            <button type="button" onClick={(e) => { e.preventDefault(); setChosenFile("") }}>unselect file</button>
            <a href="https://google.com">google</a>
            <TwitchLogin />
        </>
    );
}

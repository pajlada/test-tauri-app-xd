import { useMemo, useState } from "react";
import { ChosenFileContext } from "./ChosenFileContext";
import SplashPage from "./SplashPage";
import App from "./App";

export default function Root() {
    const [chosenFile, setChosenFile] = useState("");

    const [memoChosenFile, memoSetChosenFile] = useMemo(
        () => [chosenFile, setChosenFile],
        [chosenFile]
    );

    return (
        <ChosenFileContext.Provider value={{ chosenFile: memoChosenFile, setChosenFile: memoSetChosenFile }}>
            {chosenFile === "" ? <SplashPage /> : <App />}
        </ChosenFileContext.Provider>
    );
}

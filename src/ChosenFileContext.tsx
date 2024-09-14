import { createContext } from "react";

export interface ChosenFileContextType {
    chosenFile: string,
    setChosenFile: (chosenFile: string) => void,
}

export const ChosenFileContext = createContext<ChosenFileContextType | null>(null);

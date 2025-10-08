import { createContext } from "react";

export type NameContextType = {
    data: {
        name: string;
    },
    updateName: (name: string) => void;
}

export const NameContext = createContext<NameContextType>({
    data: {
        name: ''
    },
    updateName: () => {}
});

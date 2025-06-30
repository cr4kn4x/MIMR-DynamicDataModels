import { ProjectProvider } from "../ProjectContext";
import { DataModelsPageContextProvider } from "./PageContext";

export default function DataModelsLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProjectProvider>
            <DataModelsPageContextProvider>
                {children}
            </DataModelsPageContextProvider>
        </ProjectProvider>
    );
}

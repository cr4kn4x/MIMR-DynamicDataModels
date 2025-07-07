import { ProjectProvider } from "../ProjectContext";
import { WorkflowPageContextProvider } from "./PageContext";

export default function WorkflowsLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProjectProvider>
            <WorkflowPageContextProvider>
                {children}
            </WorkflowPageContextProvider>
        </ProjectProvider>
    )
}

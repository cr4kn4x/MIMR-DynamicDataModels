
import { ProjectProvider } from "@/app/ProjectContext";
import { NewWorkflowPageContextProvider } from "./PageContext";

export default function WorkflowViewLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProjectProvider>
            <NewWorkflowPageContextProvider>
                {children}
            </NewWorkflowPageContextProvider>
        </ProjectProvider>
    );
}

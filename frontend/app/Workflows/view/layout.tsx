import { ProjectProvider } from "@/app/ProjectContext";
import { ViewWorkflowContextProvider } from "./PageContext";


export default function WorkflowViewLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProjectProvider>
            <ViewWorkflowContextProvider>
                {children}
            </ViewWorkflowContextProvider>
        </ProjectProvider>
    );
}

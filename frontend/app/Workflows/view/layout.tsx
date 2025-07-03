import { ProjectProvider } from "@/app/ProjectContext";
import { ViewWorkflowContextProvider } from "./PageContext";
import { WorkflowPageContextProvider } from "../PageContext";


export default function WorkflowViewLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProjectProvider>
            <WorkflowPageContextProvider>
                <ViewWorkflowContextProvider>
                    {children}
                </ViewWorkflowContextProvider>
            </WorkflowPageContextProvider>
        </ProjectProvider>
    );
}

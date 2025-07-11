import { ProjectProvider } from "@/app/ProjectContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ViewWorkflowContextProvider } from "../create/PageContext";



export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <ProjectProvider>
                <SidebarProvider>
                    <ViewWorkflowContextProvider>
                        {children}
                    </ViewWorkflowContextProvider>
                </SidebarProvider>
            </ProjectProvider>
        </main>
    )
}
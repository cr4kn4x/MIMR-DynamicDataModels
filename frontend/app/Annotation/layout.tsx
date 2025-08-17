import { ProjectProvider } from "../ProjectContext";


export default function AnnotationLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProjectProvider>
                {children}
        </ProjectProvider>
    )
}

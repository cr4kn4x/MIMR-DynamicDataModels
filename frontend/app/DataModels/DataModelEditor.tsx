"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectSelectorCombobox } from "../../components/my_ui/ProjectSelectorCombobox"
import { useDataModelsPageContext } from "./PageContext"
import { FileCodeIcon } from "lucide-react"
import { DataModelCard } from "@/components/my_ui/DataModelCard"
import { cn } from "@/lib/utils"
import { useProject } from "../ProjectContext"
import { Project } from "@/lib/interfaces/DataModelInterfaces";
import { DataModel } from "@/lib/interfaces/DataModelInterfaces";


interface NoProjectSelectedProps {
    projects: Project[];
    selected_project_id: string | null;
    set_selected_project_id: (id: string | null) => void;
    refresh_projects: () => void;
}

function NoProjectSelected({ projects, selected_project_id, set_selected_project_id, refresh_projects }: NoProjectSelectedProps) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <Card className="w-96">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                        <FileCodeIcon />
                    </div>
                    <CardTitle>Welcome to Pydantic Model Builder</CardTitle>
                    <CardDescription>
                        Select a project from the dropdown above to start creating your data models
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <ProjectSelectorCombobox
                        refresh_projects_list={refresh_projects}
                        projects={projects}
                        selected_project_id={selected_project_id}
                        set_selected_project_id={set_selected_project_id}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

interface DataModelEditorContentProps {
    selected_data_model: DataModel | null;
    selected_project_id: string | null;
    refresh_data_models: () => void;
}

function DataModelEditorContent({ selected_data_model, selected_project_id, refresh_data_models }: DataModelEditorContentProps) {
    return (
        <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {selected_data_model && selected_project_id ? (
                    <DataModelCard
                        refresh_data_models={refresh_data_models}
                        data_model={selected_data_model}
                        is_selected={true}
                        preview={false}
                    />
                ) : (
                    <Card className="border-dashed border-2 border-gray-300">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-12 h-12  rounded-lg flex items-center justify-center mb-4">
                                <FileCodeIcon className="w-6 h-6 text-gray-400" />
                            </div>
                            <CardTitle className="text-gray-400">Select a Data Model to edit</CardTitle>
                            <CardDescription>
                                Choose a data model from the sidebar to start editing
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}

type DataModelEditorProps = {
    className?: string
}


export default function DataModelEditor({ className }: DataModelEditorProps) {


    const {selected_project_id, set_selected_project_id, projects, refresh_projects, refresh_data_models} = useProject()
    const {selected_data_model} = useDataModelsPageContext()


    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Main Editor Area */}
            <main className="flex-1 flex flex-col min-h-0">
                {selected_project_id ? (
                    <DataModelEditorContent
                        selected_data_model={selected_data_model}
                        selected_project_id={selected_project_id}
                        refresh_data_models={refresh_data_models}
                    />
                ) : (
                    <NoProjectSelected
                        projects={projects}
                        selected_project_id={selected_project_id}
                        set_selected_project_id={set_selected_project_id}
                        refresh_projects={refresh_projects}
                    />
                )}
            </main>
        </div>
    )
}
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectSelectorCombobox } from "../../components/my_ui/ProjectSelectorCombobox"
import { useDataModelsPageContext } from "./PageContext"
import { FileCodeIcon } from "lucide-react"
import { DataModelCard } from "@/components/my_ui/DataModelCard"
import { cn } from "@/lib/utils"



type DataModelEditorProps = {
  className?: string;
}


export default function DataModelEditor({className}: DataModelEditorProps) {

    const {
        projects,
        selected_project_id, set_selected_project_id,
        selected_data_model,
        get_and_set_projects,
        get_and_set_project_data_models,
        get_and_set_data_model,
    } = useDataModelsPageContext()


    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Main Editor Area */}
            <main className="flex-1 flex flex-col min-h-0">
                {selected_project_id ? (
                    <>
                        {/* Editor Header */}
                        <div className="bg-white border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Data Model Editor</h3>
                                    <p className="text-sm text-gray-500">Design your Data Models</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <FileCodeIcon className="w-4 h-4 mr-2" />
                                        View Code
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* Editor Content */}
                        <div className="flex-1 overflow-auto p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                {selected_data_model && selected_project_id ? (
                                    <DataModelCard
                                        project_id={selected_project_id}
                                        refresh_data_model_list={get_and_set_project_data_models}
                                        refresh_data_model={get_and_set_data_model}
                                        data_model={selected_data_model}
                                        is_selected={true}
                                        preview={false}
                                    />
                                ) : (
                                    // No data model selected state
                                    <Card className="border-dashed border-2 border-gray-300">
                                        <CardHeader className="text-center pb-4">
                                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                                <FileCodeIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <CardTitle className="text-gray-900">Select a Data Model to edit</CardTitle>
                                            <CardDescription>
                                                Choose a data model from the sidebar to start editing
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* No project selected state */
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <Card className="w-96">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <FileCodeIcon />
                                </div>
                                <CardTitle>Welcome to Pydantic Model Builder</CardTitle>
                                <CardDescription>
                                    Select a project from the dropdown above to start creating your data models
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <ProjectSelectorCombobox
                                    refresh_projects_list={get_and_set_projects}
                                    projects={projects}
                                    selected_project_id={selected_project_id}
                                    set_selected_project_id={set_selected_project_id}
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    )
}
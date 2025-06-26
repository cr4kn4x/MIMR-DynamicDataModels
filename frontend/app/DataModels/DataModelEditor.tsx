"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ProjectSelectorCombobox } from "../../components/my_ui/ProjectSelectorCombobox"
import { AppNavigation } from "@/components/my_ui/AppNavigation"
import { useDataModelsPageContext } from "./PageContext"
import { FileCodeIcon, DownloadIcon, PlayIcon } from "lucide-react"
import CreateDataModelDialog from "@/components/my_ui/CreateDataModelDialog"
import { DataModelCard } from "@/components/my_ui/DataModelCard"




export default function DataModelEditor() {

    const {
        projects,
        selected_project_id, set_selected_project_id,
        selected_project,
        selected_data_model_id, set_selected_data_model_id,
        selected_data_model,
        project_data_models,
        get_and_set_projects,
        get_and_set_project_data_models,
        get_and_set_data_model,
    } = useDataModelsPageContext()


    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Page Header */}
            <AppNavigation title="" badge="Beta">
                <div className="flex items-center space-x-3">
                    
                    <Separator orientation="vertical" className="h-6" />
                    
                    <Button variant="outline" size="sm">
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </div>
            </AppNavigation>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900">Data Models</h2>
                            {selected_project_id ?
                                (
                                    <div>
                                        <CreateDataModelDialog
                                            data_models={project_data_models}
                                            selected_project_id={selected_project_id} 
                                            refresh_data_models_list={get_and_set_project_data_models}
                                        />
                                    </div>
                                ) : (<></>)
                            }
                        </div>

                        {selected_project_id ? (
                            <div className="text-sm text-gray-600">
                                Project: {selected_project ? (selected_project.name) : (null)}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Select a project to get started
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-3">
                            {project_data_models.length === 0 && selected_project_id ? (
                                <div className="text-center py-8">
                                    <FileCodeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 mb-4">No data models yet</p>

                                    <CreateDataModelDialog 
                                        data_models={project_data_models}
                                        selected_project_id={selected_project_id} 
                                        refresh_data_models_list={get_and_set_project_data_models}
                                    />
                                </div>
                            ) : (
                                selected_project_id && 
                                project_data_models.map((model, index) => (
                                    <DataModelCard 
                                        refresh_data_model={get_and_set_data_model}
                                        refresh_data_model_list={get_and_set_project_data_models}
                                        project_id={selected_project_id}
                                        key={model.name}
                                        data_model={model}
                                        is_selected={selected_data_model_id === model.id}
                                        preview={true}

                                        onSelect={() => {
                                            // toggle --> click selected again leads to unselect
                                            set_selected_data_model_id(
                                                selected_data_model_id === model.id ? null : model.id
                                            )
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Editor Area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {selected_project_id ? (
                        <>
                            {/* Editor Header */}
                            <div className="bg-white border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Model Editor</h3>
                                        <p className="text-sm text-gray-500">Design your Pydantic models visually</p>
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
                                        // Placeholder wenn kein Data Model ausgewählt
                                        <Card className="border-dashed border-2 border-gray-300">
                                            <CardHeader className="text-center pb-4">
                                                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                                    <FileCodeIcon className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <CardTitle className="text-gray-900">Select a Data Model to edit</CardTitle>
                                                <CardDescription>
                                                    Choose a data model from the sidebar to start editing its structure
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* No Project Selected State */
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <Card className="w-96">
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <FileCodeIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <CardTitle>Welcome to Pydantic Model Builder</CardTitle>
                                    <CardDescription>
                                        Select a project from the dropdown above to start creating your data models
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Don't have a project yet?
                                    </p>
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
        </div>
    )
}
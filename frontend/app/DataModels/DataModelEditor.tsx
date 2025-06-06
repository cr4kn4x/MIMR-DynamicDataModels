"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ProjectSelectorCombobox } from "./components/ProjectDropdown"
import { useDataModelsPageContext } from "./PageContext"
import { ProjectView } from "./components/ProjectView"
import { PlusIcon, FileCodeIcon, DownloadIcon, PlayIcon } from "lucide-react"




export default function DataModelEditor() {
    const {projects, 
            selected_project_id, set_selected_project_id,
            project_data_models        
        } = useDataModelsPageContext()

    return(
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pydantic Model Builder</h1>
                        <Badge variant="secondary">Beta</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <ProjectSelectorCombobox
                            projects={projects} 
                            selected_project_id={selected_project_id} 
                            set_selected_project_id={set_selected_project_id}
                        />
                        <Separator orientation="vertical" className="h-6" />
                        <Button variant="outline" size="sm">
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button variant="outline" size="sm">
                            <PlayIcon className="w-4 h-4 mr-2" />
                            Preview
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900">Data Models</h2>
                            <Button size="sm" variant="ghost">
                                <PlusIcon className="w-4 h-4 mr-1" />
                                Add Model
                            </Button>
                        </div>
                        
                        {selected_project_id ? (
                            <div className="text-sm text-gray-600">
                                Project: {projects.find(p => p.id === selected_project_id)?.name || 'Unknown'}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Select a project to get started
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                        <ProjectView selected_project_id={selected_project_id} project_data_models={project_data_models}/>
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
                                    {/* Placeholder for when no models exist */}
                                    <Card className="border-dashed border-2 border-gray-300">
                                        <CardHeader className="text-center pb-4">
                                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                                <FileCodeIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <CardTitle className="text-gray-900">Create your first Data Model</CardTitle>
                                            <CardDescription>
                                                Start building Pydantic models by adding your first data structure
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-center pb-6">
                                            <Button>
                                                <PlusIcon className="w-4 h-4 mr-2" />
                                                Add Data Model
                                            </Button>
                                        </CardContent>
                                    </Card>
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
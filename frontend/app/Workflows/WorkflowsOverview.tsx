"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { WorkflowCard } from "@/components/my_ui/WorkflowCard"
import { ProjectSelectorCombobox } from "@/components/my_ui/ProjectSelectorCombobox"
import { AppNavigation } from "@/components/my_ui/AppNavigation"
import { useWorkflowPageContext, WorkflowPageContext } from "./PageContext"
import { FileCodeIcon, PlusCircleIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"







export default function WorkflowsOverviewPage() {

    const { projects, get_and_set_projects, selected_project_id, set_selected_project_id,
        workflows
    } = useWorkflowPageContext()


    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <AppNavigation title="Workflows" badge="Prototyp">
                <ProjectSelectorCombobox 
                    projects={projects} 
                    refresh_projects_list={get_and_set_projects} 
                    selected_project_id={selected_project_id} 
                    set_selected_project_id={set_selected_project_id} 
                />
            </AppNavigation>
            <main>
                {selected_project_id ?
                    (
                        workflows.length > 0 ? (
                            <div className="p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-auto">
                                {workflows.map((wf) => (
                                    <WorkflowCard key={wf.id} workflow={wf} />
                                ))}
                                <div className="flex justify-center items-center">
                                    <Link href={`/Workflows/new?project_id=${selected_project_id}`}>
                                        <Button>
                                            Add Workflow
                                            <PlusCircleIcon />
                                        </Button>
                                    </Link>
                                </div>
                            </div>) : (
                            <div className="flex items-center justify-center mt-10">
                                <Card className="w-96">
                                    <CardHeader className="text-center">
                                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                            <FileCodeIcon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <CardTitle>Create your first workflow!</CardTitle>
                                        <CardDescription>
                                            Creating a workflow is the first step to make your data machine readable!
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center">

                                        <Link href={`/Workflows/new?project_id=${selected_project_id}`}>
                                            <Button>
                                                Create Workflow
                                                <PlusCircleIcon />
                                            </Button>
                                        </Link>

                                    </CardContent>
                                </Card>
                            </div>
                        )
                    )
                    :
                    (
                        <div className="flex items-center justify-center mt-10">
                            <Card className="w-96">
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <FileCodeIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <CardTitle>Welcome to the Workflow Editor</CardTitle>
                                    <CardDescription>
                                        Select a project from the dropdown above to start creating and editing workflows
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Don't have a project yet?
                                        <span> </span>
                                        <Link href={"/DataModels"} className="underline">Open Data Model Editor</Link>
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
                    )
                }
            </main>
        </div>
    );
}

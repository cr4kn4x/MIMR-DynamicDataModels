"use client"
import { getAllProjects } from "@/lib/api/DataModelApi"
import { getWorkflowsByProjectId } from "@/lib/api/WorkflowApi"
import { Project } from "@/lib/interfaces/DataModelInterfaces"
import { Workflow } from "@/lib/interfaces/WorkflowInteraces"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useProject } from "@/context/ProjectContext"




export interface WorkflowPageContextType {
    selected_project_id: string | null
    selected_project: Project | null
    set_selected_project_id(id: string | null): void
    
    projects: Project[]
    get_and_set_projects(): void
    
    workflows: Workflow[]
}


export const WorkflowPageContext = createContext<WorkflowPageContextType | undefined>(undefined)


export function useWorkflowPageContext() {
    const ctx = useContext(WorkflowPageContext)
    if (!ctx) throw new Error("useWorkflowPageContext must be used within WorkflowPageContextProvider")
    return ctx
}


export function WorkflowPageContextProvider({ children }: { children: ReactNode }) {
    const { project } = useProject()
    const [projects, set_projects] = useState<Project[]>([])
    const [selected_project_id, set_selected_project_id] = useState<string|null>(null)
    const [workflows, set_workflows] = useState<Workflow[]>([])

    useEffect(() => {
        if (project) {
            set_selected_project_id(project.id)
        }
    }, [project])

    async function get_and_set_projects() {
        getAllProjects()
            .then((res) => {set_projects(res.projects)})
            .catch((error) => {toast.error("Error in get_and_set_projects", {description: error.message, richColors: true})}) 
    }

    async function get_and_set_workflows(project_id: string) {
        getWorkflowsByProjectId(project_id)
            .then((res) => {set_workflows(res.workflows)})
            .catch((error) => {toast.error("Error in get_and_set_workflows", {description: error.message, richColors: true})}) 
    }

    // 
    const selected_project = selected_project_id
        ? projects.find(project => project.id === selected_project_id) || null
        : null


    useEffect(() => {
        get_and_set_projects()
    }, [])


    useEffect(() => {
        if(!selected_project_id){
            set_workflows([])
            return
        }
        get_and_set_workflows(selected_project_id)
    }, [selected_project_id])
    

    const value: WorkflowPageContextType = {
        selected_project_id, 
        selected_project,
        set_selected_project_id,
        get_and_set_projects,
        projects,
        workflows
    }
    
    return React.createElement(WorkflowPageContext.Provider, { value: value }, children)
}

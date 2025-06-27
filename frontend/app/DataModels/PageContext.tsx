"use client"
import { getAllProjects, getDataModelById, getDataModelsByProjectId } from "@/lib/api/DataModelApi"
import { DataModel, Project } from "@/lib/interfaces/DataModelInterfaces"
import React, { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react"
import { toast } from "sonner"
import { useProject } from "@/context/ProjectContext"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"




export interface DataModelsContextType {
    selected_project_id: string | null
    set_selected_project_id(id: string|null): void 

    selected_project: Project | null 

    projects: Project[]
    set_projects(lst: Project[]): void

    project_data_models: DataModel[]
    set_project_data_models (v: DataModel[]): void 

    selected_data_model_id: string | null 
    set_selected_data_model_id(id: string | null): void

    selected_data_model: DataModel | null // computed property


    get_and_set_projects(): void
    get_and_set_project_data_models(project_id: string): void
    get_and_set_data_model(data_model_id: string): void
}


export const DataModelsPageContext = createContext<DataModelsContextType | undefined>(undefined)


export function useDataModelsPageContext() {
    const ctx = useContext(DataModelsPageContext)
    if (!ctx) throw new Error("useDataModelsPageContext must be used within DataModelsPageContextProvider")
    return ctx
}


export function DataModelsPageContextProvider({ children }: { children: ReactNode }) {
    const { project } = useProject()
    const [projects, set_projects] = useState<Project[]>([])
    const [selected_project_id, set_selected_project_id] = useState<string|null>(null)
    const [project_data_models, set_project_data_models] = useState<DataModel[]>([])
    const [selected_data_model_id, set_selected_data_model_id] = useState<string | null>(null)

   
    const selected_data_model = useMemo(() => {
        if (!selected_data_model_id) return null;
        const found = project_data_models.find(dm => dm.id === selected_data_model_id);
        return found || null;
    }, [selected_data_model_id, project_data_models])
    
    const selected_project = useMemo(() => {
        if (!selected_project_id) return null;
        const found = projects.find(project => project.id === selected_project_id);
        return found || null;
    }, [selected_project_id, projects])

    useEffect(() => {
        if (project) {
            set_selected_project_id(project.id)
        }
    }, [project])
    

    
    async function get_and_set_projects() {
        const res = await apiCallWrapper(getAllProjects(), toast, "Error in get_and_set_projects")

        if (res) set_projects(res.projects)
    }


    async function get_and_set_project_data_models(project_id: string){
        const res = await apiCallWrapper(getDataModelsByProjectId(project_id), toast, "Error in get_and_set_project_data_models")
    
        if (res) set_project_data_models(res.data_models)
    }


    async function get_and_set_data_model(data_model_id: string) {
        const res = await apiCallWrapper(getDataModelById(data_model_id), toast, "Error in get_and_set_data_model")

        if(res){
            const updated_data_model = res.data_model;
            // Update the project_data_models list
            set_project_data_models(prev => 
                prev.map(dm => dm.id === data_model_id ? updated_data_model : dm)
            )
        }
    }



    // initial fetch
    useEffect(()=>{
        get_and_set_projects()
    }, [])
    

    useEffect(() => {
        if(selected_project_id == null){
            set_project_data_models([])
            set_selected_data_model_id(null) 
            return
        }

        get_and_set_project_data_models(selected_project_id)
    }, [selected_project_id])
    
    


    const value: DataModelsContextType = {
        selected_project_id,
        set_selected_project_id,
        
        selected_project,

        projects, 
        set_projects,

        project_data_models,
        set_project_data_models,

        selected_data_model_id,
        set_selected_data_model_id,
        
        selected_data_model,

        get_and_set_projects,
        get_and_set_project_data_models,
        get_and_set_data_model        
    }
    
    return React.createElement(DataModelsPageContext.Provider, { value: value }, children)
}

"use client"
import { getAllProjects, getDataModelsByProjectId } from "@/lib/api/DataModelApi"
import { DataModel, Project } from "@/lib/interfaces/DataModelInterfaces"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"




export interface DataModelsContextType {
    selected_project_id: string | null
    set_selected_project_id(id: string|null): void 

    projects: Project[]
    set_projects(lst: Project[]): void

    project_data_models: DataModel[]
    set_project_data_models (v: DataModel[]): void 

    selected_data_model: DataModel | null 
    set_selected_data_model(v: DataModel | null): void
}


export const DataModelsPageContext = createContext<DataModelsContextType | undefined>(undefined)


export function useDataModelsPageContext() {
    const ctx = useContext(DataModelsPageContext)
    if (!ctx) throw new Error("useDataModelsPageContext must be used within DataModelsPageContextProvider")
    return ctx
}


export function DataModelsPageContextProvider({ children }: { children: ReactNode }) {
    const [selected_data_model, set_selected_data_model] = useState<DataModel | null>(null)
    const [selected_project_id, set_selected_project_id] = useState<string | null>(null)
    const [projects, set_projects] = useState<Project[]>([])
    const [project_data_models, set_project_data_models] = useState<DataModel[]>([])



    // initial fetch
    useEffect(()=>{
        getAllProjects()
            .then((res) => {set_projects(res.projects)})
            .catch((error) => {console.error(error.message)}) // can be shown in toast for example ... 
    }, [])

    
    useEffect(() => {
        if(selected_project_id == null){
            set_project_data_models([])
            return
        }

        getDataModelsByProjectId(selected_project_id)
            .then((res) => {set_project_data_models(res.data_models)})
            .catch((error) => {console.error(error.message)}) // maybe toast
    }, [selected_project_id])
    
    
    const value: DataModelsContextType = {
        selected_project_id,
        set_selected_project_id,
        
        projects, 
        set_projects,

        project_data_models,
        set_project_data_models,

        selected_data_model,
        set_selected_data_model
    }
    
    return React.createElement(DataModelsPageContext.Provider, { value: value }, children)
}

"use client"
import { getAllProjects } from "@/lib/api/DataModelApi"
import { Project } from "@/lib/interfaces/DataModelInterfaces"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"




export interface DataModelsContextType {
    selected_project_id: string | null
    set_selected_project_id(id: string|null): void 

    projects: Project[]
    set_projects(lst: Project[]): void
}


export const DataModelsPageContext = createContext<DataModelsContextType | undefined>(undefined)


export function useDataModelsPageContext() {
    const ctx = useContext(DataModelsPageContext)
    if (!ctx) throw new Error("useDataModelsPageContext must be used within DataModelsPageContextProvider")
    return ctx
}


export function DataModelsPageContextProvider({ children }: { children: ReactNode }) {
    
    const [selected_project_id, set_selected_project_id] = useState<string | null>(null)
    const [projects, set_projects] = useState<Project[]>([])


    // initial fetch
    useEffect(()=>{
        getAllProjects()
            .then((projects) => {set_projects(projects)})
            .catch((error) => {console.error(error.message)}) // can be shown in toast for example ... 
    }, [])

    const value: DataModelsContextType = {
        selected_project_id,
        set_selected_project_id,
        projects, 
        set_projects
    }
    
    return React.createElement(DataModelsPageContext.Provider, { value: value }, children)
}

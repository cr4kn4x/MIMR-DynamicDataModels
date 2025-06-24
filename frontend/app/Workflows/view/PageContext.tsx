"use client"
import { getAllProjects, getDataModelById, getDataModelsByProjectId } from "@/lib/api/DataModelApi"
import { DataModel, Project, DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import { useSearchParams } from "next/navigation"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'



export interface WorkflowViewerPageContextType {
    data_models: DataModel[];
    project_id: string;
    create_new: boolean;
}

export const WorkflowViewerPageContext = createContext<WorkflowViewerPageContextType | undefined>(undefined)

export function useWorkflowViewerPageContext() {
    const ctx = useContext(WorkflowViewerPageContext)
    if (!ctx) throw new Error("useWorkflowViewerPageContext must be used within WorkflowViewerPageContextProvider")
    return ctx
}

export function WorkflowViewerPageContextProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    
    const searchParams = useSearchParams()
    const url_project_id = searchParams.get("project_id")
    const url_create_new = searchParams.get("create_new") === "true"
    const [data_models, set_data_models] = useState<DataModel[]>([])
    

    async function get_and_set_data_models(project_id: string){
        getDataModelsByProjectId(project_id)
            .then((res) => {set_data_models(res.data_models)})
            .catch((error) => {toast.error("Error in get_and_set_data_models", {description: error.message, richColors: true}); router.push("/Workflows")}) 
    }

    useEffect(() => {
        if (!url_project_id || typeof url_create_new === "undefined") {
            toast.error("Missing url params", {richColors: true})
            router.push("/Workflows")
            return
        }
        get_and_set_data_models(url_project_id)
    }, [url_project_id, url_create_new])

    const value: WorkflowViewerPageContextType = {
        data_models,
        project_id: url_project_id!,
        create_new: url_create_new,
    }

    return (
        <WorkflowViewerPageContext.Provider value={value}>
            {children}
        </WorkflowViewerPageContext.Provider>
    )
}

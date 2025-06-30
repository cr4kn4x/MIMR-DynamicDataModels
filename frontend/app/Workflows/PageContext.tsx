"use client"
import { getWorkflowsByProjectId } from "@/lib/api/WorkflowApi"
import { Workflow } from "@/lib/interfaces/WorkflowInteraces"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useProject } from "../ProjectContext"


export interface WorkflowPageContextType {
    workflows: Workflow[]
}


export const WorkflowPageContext = createContext<WorkflowPageContextType | undefined>(undefined)


export function useWorkflowPageContext() {
    const ctx = useContext(WorkflowPageContext)
    if (!ctx) throw new Error("useWorkflowPageContext must be used within WorkflowPageContextProvider")
    return ctx
}


export function WorkflowPageContextProvider({ children }: { children: ReactNode }) {

    const [workflows, set_workflows] = useState<Workflow[]>([])
    const {selected_project_id} = useProject() 


    async function refresh_workflows() {
        if(selected_project_id){
            getWorkflowsByProjectId(selected_project_id)
            .then((res) => {set_workflows(res.workflows)})
            .catch((error) => {toast.error("Error in get_and_set_workflows", {description: error.message, richColors: true})}) 
        }
    }

    
    useEffect(() => {
        if(!selected_project_id){
            set_workflows([])
            return
        }
        refresh_workflows()
    }, [selected_project_id])
    

    const value: WorkflowPageContextType = {
        workflows
    }
    
    return React.createElement(WorkflowPageContext.Provider, { value: value }, children)
}

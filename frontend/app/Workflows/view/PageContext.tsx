"use client"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useProject } from "@/app/ProjectContext"

export interface NewWorkflowPageContextType {
    selected_workflow_id: string | null
    create: boolean
}


export const NewWorkflowPageContext = createContext<NewWorkflowPageContextType | undefined>(undefined)

export function useNewWorkflowPageContext() {
    const ctx = useContext(NewWorkflowPageContext)
    if (!ctx) throw new Error("useNewWorkflowPageContext must be used within NewWorkflowPageContextProvider")
    return ctx
}


export function NewWorkflowPageContextProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams()

    const [selected_project_id, set_selected_project_id] = useState<string | null>(null)
    const [create, set_create] = useState<boolean>(false)
    const [selected_workflow_id, set_selected_workflow_id] = useState<string|null>(null)


    
    const {} = useProject()


    

   


    useEffect(() => {
        const url_project_id = searchParams.get("project_id")
        if (url_project_id) {set_selected_project_id(url_project_id)} else  {set_selected_project_id(null)}

        const url_create = searchParams.get("create")
        if(url_create=="1") {set_create(true)} else {set_create(false)}

        const url_workflow_id = searchParams.get("workflow_id")
        if(selected_workflow_id) {set_selected_workflow_id(url_workflow_id)} else {set_selected_workflow_id(null)}

        if(url_create == "1" && url_workflow_id){
            toast.error("Unexpected url-param configuration", {richColors: true})
        }
    }, [searchParams])


  


    const value: NewWorkflowPageContextType = {
        selected_workflow_id, 
        create
    }

    return React.createElement(NewWorkflowPageContext.Provider, { value: value }, children)
}

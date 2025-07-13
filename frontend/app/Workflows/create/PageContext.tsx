"use client"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useProject } from "@/app/ProjectContext"
import { getWorkflowById } from "@/lib/api/WorkflowApi"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"
import { Workflow, WorkflowPopulated } from "@/lib/interfaces/WorkflowInteraces"
import { useWorkflowPageContext } from "../PageContext"
import { getDataModelById } from "@/lib/api/DataModelApi"

export interface ViewWorkflowPageContextType {
    selected_workflow_id: string | null
    selected_workflow: Workflow | null
    selected_workflow_populated: WorkflowPopulated | null
    create: boolean
}


export const NewWorkflowPageContext = createContext<ViewWorkflowPageContextType | undefined>(undefined)

export function viewWorkflowPageContext() {
    const ctx = useContext(NewWorkflowPageContext)
    if (!ctx) throw new Error("viewWorkflowContext must be used within viewWorkflowContextProvider")
    return ctx
}


export function ViewWorkflowContextProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams()

    const {selected_project_id} = useProject()
    const {workflows} = useWorkflowPageContext()
    
    
    const [create, set_create] = useState<boolean>(false)
    const [selected_workflow_id, set_selected_workflow_id] = useState<string|null>(null)

    const [selected_workflow, set_selected_workflow] = useState<Workflow|null>(null)
    const [selected_workflow_populated, set_selected_workflow_populated] = useState<WorkflowPopulated|null>(null)


    const refresh_selected_workflow = async () => {
        if(selected_workflow_id){
            const res = await apiCallWrapper(getWorkflowById(selected_workflow_id), toast, "Error while fetching workflow")
            console.log(res?.workflow)
            if(res){set_selected_workflow(res.workflow); fetch_set_populated_workflow(res.workflow)}
            return 
        }
        set_selected_workflow(null)
    }


    useEffect(() => {
        const url_create = searchParams.get("create")
        if(url_create=="1") {set_create(true)} else {set_create(false)}

        const url_workflow_id = searchParams.get("workflow_id")
        if(url_workflow_id) {set_selected_workflow_id(url_workflow_id)} else {set_selected_workflow_id(null)}
    }, [])  




    useEffect(() => {
        if(selected_workflow_id){
            refresh_selected_workflow()
        }
    }, [selected_workflow_id])



    const fetch_set_populated_workflow = async (selected_workflow: Workflow) => {
        const input_res = await apiCallWrapper(getDataModelById(selected_workflow.input_data_model), toast, "Failed to fetch input data model")
        const output_res = await apiCallWrapper(getDataModelById(selected_workflow.output_data_model), toast, "Failed to fetch output data model")

        if(!input_res || !output_res){return}
        set_selected_workflow_populated({...selected_workflow, input_data_model: input_res.data_model, output_data_model: output_res.data_model})
    }

    useEffect(()=>{
        console.log(selected_workflow_populated)
    }, [selected_workflow_populated])


    const value: ViewWorkflowPageContextType = {
        selected_workflow_id, 
        selected_workflow,
        selected_workflow_populated,
        create
    }

    return React.createElement(NewWorkflowPageContext.Provider, { value: value }, children)
}

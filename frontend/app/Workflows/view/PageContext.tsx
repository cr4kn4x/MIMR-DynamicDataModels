"use client"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"
import { getDataModelsByProjectId } from "@/lib/api/DataModelApi"
import { toast } from "sonner"
import { LLM } from "@/lib/interfaces/LlmInterfaces"
import { getLlms } from "@/lib/api/WorkflowApi"

export interface NewWorkflowPageContextType {
    selected_project_id: string | null
    selected_workflow_id: string | null
    create: boolean
    data_models: DataModel[]
    llms: LLM[]
    get_and_set_llms: () => void
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


    const [data_models, set_data_models] = useState<DataModel[]>([])
    const [llms, set_llms] = useState<LLM[]>([])


    const get_and_set_llms = async () => {
        const res = await apiCallWrapper(getLlms(), toast, "Error in get_and_set_llms")
        if (res) { set_llms(res.llms) }
    }

    const get_and_set_data_models = async (selected_project_id: string) => {
        const res = await apiCallWrapper(getDataModelsByProjectId(selected_project_id), toast, `Error in get_and_set_data_models for project id ${selected_project_id}`)
        if (res) { set_data_models(res.data_models) }
    }


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


    useEffect(() => {
        if (selected_project_id) {
            get_and_set_data_models(selected_project_id)
        }
    }, [selected_project_id])


    useEffect(() => {
        get_and_set_llms()
    }, [])

    const value: NewWorkflowPageContextType = {
        selected_project_id,
        selected_workflow_id, 
        create,
        data_models,
        llms,
        get_and_set_llms
    }

    return React.createElement(NewWorkflowPageContext.Provider, { value: value }, children)
}

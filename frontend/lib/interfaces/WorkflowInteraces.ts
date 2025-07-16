import { DataModel } from "./DataModelInterfaces"




export interface Workflow {
    project_id: string
    id: string
    name: string
    llm: string
    input_data_model: string
    output_data_model: string
    active: boolean
}


export interface WorkflowPopulated {
    project_id: string
    id: string
    name: string
    llm: string
    input_data_model: DataModel
    output_data_model: DataModel
    active: boolean
}

export interface WorkflowApiKey {
    id: string, 
    workflow_id: string, 
    name: string, 
    api_key_preview: string, 
    created_at: string, 
    last_used_at: string, 
    last_refreshed_at: string,
}
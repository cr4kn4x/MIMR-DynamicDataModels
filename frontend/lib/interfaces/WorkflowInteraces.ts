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
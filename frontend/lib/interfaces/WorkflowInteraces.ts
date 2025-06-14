import { DataModel } from "./DataModelInterfaces"







export interface Workflow {
    name: string
    id: string


    input: DataModel
    output: DataModel
    
}


export interface Project {
    id: string 
    name: string
}

export interface DataModelField {
    id: string
    name: string
    type: string
    description: string | null
}

export interface DataModel {
    id: string
    name: string
    fields: DataModelField[]
}
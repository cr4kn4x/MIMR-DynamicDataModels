

export interface Project {
    project_id: string 
    project_name: string
}


export interface DataModelField {
    name: string;
    type: string;
    description: string | null;
}

export interface DataModel {
    name: string;
    fields: DataModelField[];
}

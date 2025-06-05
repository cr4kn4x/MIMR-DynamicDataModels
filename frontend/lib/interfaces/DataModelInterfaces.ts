

export interface Project {
    id: string 
    name: string
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

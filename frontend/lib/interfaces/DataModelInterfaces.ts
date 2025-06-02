export interface DataModelField {
    name: string;
    type: string;
    description: string | null;
}

export interface DataModel {
    name: string;
    fields: DataModelField[];
}

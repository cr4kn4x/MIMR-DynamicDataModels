export interface ModelFieldDefinition {
    name: string;
    type: string;
    description: string | null;
}

export interface ModelDefinition {
    name: string;
    fields: ModelFieldDefinition[];
}

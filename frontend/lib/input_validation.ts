import { InputValidationResult } from "./interfaces/internal"

export const MAX_LENGTH_PROJECT_NAME = 64
export const MAX_LENGTH_DATA_MODEL_NAME = 64
export const MAX_LENGTH_DATA_MODEL_FIELD_NAME= 64





export function validateProjectName(name: string, existing_projects: string[]): InputValidationResult {
    const trimmedName = name.trim()

    // check not empty
    if(!trimmedName){
        return { is_valid: false, msg: "Project name cannot be empty" }
    }

    // check length
    if(trimmedName.length > MAX_LENGTH_PROJECT_NAME){
        return { is_valid: false, msg: `Project name must be less than ${MAX_LENGTH_PROJECT_NAME} characters`}
    }

    // check if project with identical name already exists
    if (existing_projects.includes(trimmedName)) {
        return { is_valid: false, msg: "Project with this name already exists"};
    }

    // seems valid
    return {is_valid: true, msg: "Project name looks good!"}
}



export function validateDataModelName(name: string, existing_data_models: string[]): InputValidationResult {
    const trimmedName = name.trim()

    // check not empty
    if(!trimmedName){
        return { is_valid: false, msg: "Data model name cannot be empty"}
    }

    // check length
    if(trimmedName.length > MAX_LENGTH_DATA_MODEL_NAME){
        return { is_valid: false, msg: "Data model name must be less than 64 characters"}
    }

    // check valid character
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(trimmedName)) {
        return { is_valid: false, msg: "Data model name can only contain A-Z, a-z, 0-9, _"};
    }


    // check if project with identical name already exists
    if (existing_data_models.includes(trimmedName)) {
        return { is_valid: false, msg: "Data model with this name already exists" };
    }


    // seems valid
    return {is_valid: true, msg: "Data model name looks good!"}
}



export function validateDataModelFieldName(name: string, data_model_fields: string[]): InputValidationResult{   
    const trimmedName = name.trim()

    // check not empty
    if(!trimmedName){
        return { is_valid: false, msg: "Field name cannot be empty"}
    }

    // check length
    if(trimmedName.length > MAX_LENGTH_DATA_MODEL_FIELD_NAME){
        return { is_valid: false, msg: "Field name must be less than 64 characters"}
    }

    // check valid character
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(trimmedName)) {
        return { is_valid: false, msg: "Field name can only contain A-Z, a-z, 0-9, _"};
    }


    // check if project with identical name already exists
    if (data_model_fields.includes(trimmedName)) {
        return { is_valid: false, msg: "Field with this name already exists" };
    }


    // seems valid
    return {is_valid: true, msg: "Field name looks good!"}
}


export function validateDataModelFieldType(type: string): InputValidationResult {
    if(type.trim() == ""){
        return { is_valid: false, msg: "Invalid type" }
    }

    return { is_valid: true, msg: "Type is valid"}
}


export function validateDataModelFieldDescription(description: string | null): InputValidationResult {

    if(!description) {
        return {is_valid: true, msg: "Description is valid"}   
    }    
    
    
    const trimmed_description = description.trim()

     // check valid character
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(trimmed_description)) {
        return { is_valid: false, msg: "Description can only contain A-Z, a-z, 0-9, _"};
    }

    //
    return { is_valid: true, msg: "Description is valid"}
}


export function validateWorkflowName(name: string): InputValidationResult {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return { is_valid: false, msg: "Workflow name cannot be empty" };
    }

    if (trimmedName.length > 64) {
        return { is_valid: false, msg: "Workflow name must be less than 64 characters" };
    }

    return { is_valid: true, msg: "Workflow name looks good!" };
}

export function validateWorkflowLLM(llm: string): InputValidationResult {
    if (!llm) {
        return { is_valid: false, msg: "LLM must be selected" };
    }

    return { is_valid: true, msg: "LLM is valid" };
}

export function validateWorkflowDataModel(dataModel: any, type: "Input" | "Output"): InputValidationResult {
    if (!dataModel) {
        return { is_valid: false, msg: `${type} Data Model must be selected` };
    }

    return { is_valid: true, msg: `${type} Data Model is valid` };
}
export const MAX_LENGTH_PROJECT_NAME = 64
export const MAX_LENGTH_DATA_MODEL_NAME = 64
export const MAX_LENGTH_DATA_MODEL_FIELD_NAME= 64


interface ValidationResult {
    is_valid: boolean, 
    msg: string, 
    severity: "error" | "none"
}


export function validateProjectName(name: string, existing_projects: string[]): ValidationResult {
    const trimmedName = name.trim()

    // check not empty
    if(!trimmedName){
        return { is_valid: false, msg: "Project name cannot be empty", severity: 'error' }
    }

    // check length
    if(trimmedName.length > MAX_LENGTH_PROJECT_NAME){
        return { is_valid: false, msg: "Project name must be less than 64 characters", severity: 'error' }
    }

    // check valid character
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(trimmedName)) {
        return { is_valid: false, msg: "Project name can only contain A-Z, a-z, 0-9, _", severity: 'error' };
    }


    // check if project with identical name already exists
    if (existing_projects.includes(trimmedName)) {
        return { is_valid: false, msg: "Project with this name already exists", severity: "error" };
    }


    // seems valid
    return {is_valid: true, msg: "Project name looks good!", severity: "none"}
}



export function validateDataModelName(name: string, existing_data_models: string[]): ValidationResult {
    const trimmedName = name.trim()

    // check not empty
    if(!trimmedName){
        return { is_valid: false, msg: "Data model name cannot be empty", severity: 'error' }
    }

    // check length
    if(trimmedName.length > MAX_LENGTH_DATA_MODEL_NAME){
        return { is_valid: false, msg: "Data model name must be less than 64 characters", severity: 'error' }
    }

    // check valid character
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(trimmedName)) {
        return { is_valid: false, msg: "Data model name can only contain A-Z, a-z, 0-9, _", severity: 'error' };
    }


    // check if project with identical name already exists
    if (existing_data_models.includes(trimmedName)) {
        return { is_valid: false, msg: "Data model with this name already exists", severity: "error" };
    }


    // seems valid
    return {is_valid: true, msg: "Data model name looks good!", severity: "none"}
}



export function validateDataModelFieldName(name: string, data_model_fields: string[]): ValidationResult{   
    const trimmedName = name.trim()

    // check not empty
    if(!trimmedName){
        return { is_valid: false, msg: "Field name cannot be empty", severity: 'error' }
    }

    // check length
    if(trimmedName.length > MAX_LENGTH_DATA_MODEL_FIELD_NAME){
        return { is_valid: false, msg: "Field name must be less than 64 characters", severity: 'error' }
    }

    // check valid character
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(trimmedName)) {
        return { is_valid: false, msg: "Field name can only contain A-Z, a-z, 0-9, _", severity: 'error' };
    }


    // check if project with identical name already exists
    if (data_model_fields.includes(trimmedName)) {
        return { is_valid: false, msg: "Field with this name already exists", severity: "error" };
    }


    // seems valid
    return {is_valid: true, msg: "Field name looks good!", severity: "none"}
}


export function validateDataModelFieldType(type: string): ValidationResult {
    if(type.trim() == ""){
        return { is_valid: false, msg: "Invalid type", severity: "error" }
    }

    return { is_valid: true, msg: "Type is valid", severity: "none"}
}


export function validateDataModelFieldDescription(description: string | null): ValidationResult {

    if(!description) {
        return {is_valid: true, msg: "Description is valid", severity: "none"}   
    }    
    
    
    const trimmed_description = description.trim()

     // check valid character
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(trimmed_description)) {
        return { is_valid: false, msg: "Description can only contain A-Z, a-z, 0-9, _", severity: 'error' };
    }

    //
    return { is_valid: true, msg: "Description is valid", severity: "none"}
}
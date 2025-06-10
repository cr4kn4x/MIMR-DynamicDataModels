export const MAX_LENGTH_PROJECT_NAME = 64
export const MAX_LENGTH_DATA_MODEL_NAME = 64


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
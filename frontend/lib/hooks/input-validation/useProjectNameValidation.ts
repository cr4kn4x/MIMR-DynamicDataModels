import { Project } from "../../interfaces/DataModelInterfaces";
import { InputValidationResult } from "../../interfaces/internal";
import { MAX_LENGTH_PROJECT_NAME } from "./constants";
import { extractFirstError, validateDuplicate, validateStringInput } from "./functions";




interface ProjectValidation {
    name_validation: InputValidationResult

    input_valid_status: string
    input_valid: boolean
}

export function useProjectNameValidation(
    name: string,
    projects: Project[]
): ProjectValidation {    
    // 
    const trimmed_name = name.trim() 

    // call validators
    const name_validation = validateStringInput(trimmed_name, MAX_LENGTH_PROJECT_NAME, projects.map((p)=>{return p.name}))


    // compute valid state as boolean
    const {input_valid, input_valid_status} = extractFirstError(name_validation)
    
    return {
        name_validation,
        
        input_valid_status,
        input_valid
    }
}
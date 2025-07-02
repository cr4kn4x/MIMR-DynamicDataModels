import { validateProjectName } from "@/lib/input_validation";
import { Project } from "../interfaces/DataModelInterfaces";
import { InputValidationResult } from "../interfaces/internal";




interface ProjectValidation {
    project_name_validation: InputValidationResult
    input_valid: boolean
}

export function useProjectNameValidation(
    name: string,
    projects: Project[]
): ProjectValidation {
    
    const project_name_validation = validateProjectName(name, projects.map((project) => { return project.name }))


    // is all valid
    const is_valid = project_name_validation.is_valid

  
    return {
        project_name_validation, 
        input_valid: is_valid
    }
}

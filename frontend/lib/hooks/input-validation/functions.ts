import { InputValidationResult } from "@/lib/interfaces/internal"


export function validateStringInput(input: string, max_length: number, existing_names: string[]): InputValidationResult {
    // cut empty spaces at start and end
    const trimmed_input = input.trim()

    if(!trimmed_input){
        return { is_valid: false, msg: "Cannot be empty"}
    }

    // check duplicates
    if(existing_names.includes(trimmed_input)){
        return {is_valid: false, msg: "Already exists"}
    }

    // check valid length
    if(trimmed_input.length > max_length){
        return { is_valid: false, msg: `Maximum length is ${max_length} characters`} 
    }

    // check a-z A-Z 0-9 _
    const regex = /^[a-zA-Z0-9_]*$/
    if (!regex.test(trimmed_input)) {
        return { is_valid: false, msg: "Charset is restricted to A-Z, a-z, 0-9, _"}
    }

    // 
    return {is_valid: true, msg: `Input is valid`}
}



export function validateDuplicate(input: string, existing: string[]): InputValidationResult {
    // 
    const trimmed_input = input.trim() 

    if(existing.includes(trimmed_input)){
        return {is_valid: false, msg: "Already exists"}
    }

    return {is_valid: true, msg: "Input is valid"}
}


export function extractFirstError(...validations: InputValidationResult[]): {input_valid: boolean, input_valid_status: string} {
    for (const validation of validations) {
        if (!validation.is_valid) {
            return {input_valid: false, input_valid_status: validation.msg}
        }
    }
    
    return {input_valid: true, input_valid_status: "Input is valid"}
}
import { InputValidationResult } from "@/lib/interfaces/internal"


export function validateStringInput(input: string, max_length: number): InputValidationResult {
    // cut empty spaces at start and end
    const trimmed_input = input.trim()

    if(!trimmed_input){
        return { is_valid: false, msg: "Input cannot be empty"}
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
    return {is_valid: true, msg: "Input seems fine"}
}



export function duplicateValidation(input: string, existing: string[], type_hint: string): InputValidationResult {
    // 
    const trimmed_input = input.trim() 

    if(existing.includes(trimmed_input)){
        return {is_valid: false, msg: `${type_hint} already exists`}
    }

    return {is_valid: true, msg: "Input seems fine"}
}
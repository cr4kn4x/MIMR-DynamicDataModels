import { DataModel, DataModelField } from "@/lib/interfaces/DataModelInterfaces";
import { InputValidationResult } from "../../interfaces/internal";
import { MAX_LENGTH_DATA_MODEL_FIELD_DESCRIPTION, MAX_LENGTH_DATA_MODEL_FIELD_NAME } from "./constants";
import { extractFirstError, validateDuplicate, validateStringInput } from "./functions";
import { IBM_Plex_Sans_Devanagari } from "next/font/google";


interface DataModelFieldValidation {
    name_validation: InputValidationResult
    type_validation: InputValidationResult
    description_validation: InputValidationResult

    input_valid: boolean
    input_valid_status: string
}



export function useDataModelFieldValidation(
    name: string,
    type: string,
    description: string | null,
    data_model_fields: DataModelField[]
): DataModelFieldValidation {
    const trimmed_name = name.trim() 

    // call validators
    const name_validation = validateStringInput(trimmed_name, MAX_LENGTH_DATA_MODEL_FIELD_NAME, data_model_fields.map((dmf)=>{return dmf.name}))
    
    const type_validation = validateDataType(type)
    
    const description_validation = validateDescription(description, MAX_LENGTH_DATA_MODEL_FIELD_DESCRIPTION)

    


    // 
    const {input_valid, input_valid_status} = extractFirstError(name_validation, type_validation, description_validation)




    return {
        name_validation,
        type_validation,
        description_validation,
        
        input_valid_status,
        input_valid
    }
}


const validateDataType = (type: string): InputValidationResult => {
    const type_trimmed = type.trim() 

    if(type_trimmed.length == 0){
        return {is_valid: false, msg: "Type is required"}
    }

    return {is_valid: true, msg: "Type is valid"}
}


function validateDescription(description: string | null, max_length: number): InputValidationResult {
    if(description == null){
        return {is_valid: true, msg: "Description is valid"}
    }

    const trimmed_input = description.trim()
    
    // check valid length
    if(trimmed_input.length > max_length){
        return { is_valid: false, msg: `Maximum length is ${max_length} characters`} 
    }

    // check all printable ASCII characters
    const regex = /^[\x20-\x7E]*$/
    if (!regex.test(trimmed_input)) {
        return { is_valid: false, msg: "Only printable ASCII characters are allowed"}
    }

    // 
    return {is_valid: true, msg: `Input is valid`}
}

import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { InputValidationResult } from "@/lib/interfaces/internal"
import { MAX_LENGTH_DATA_MODEL_NAME } from "./constants"
import { extractFirstError, validateDuplicate, validateStringInput } from "./functions"



interface DataModelNameValidation {
    name_validation: InputValidationResult

    input_valid_status: string
    input_valid: boolean
}

export function useDataModelNameValidation(name: string, data_models: DataModel[]): DataModelNameValidation {
    const trimmed_name = name.trim() 

    const name_validation = validateStringInput(trimmed_name, MAX_LENGTH_DATA_MODEL_NAME, data_models.map((d)=>{return d.name}))
    
    // 
    const {input_valid, input_valid_status} = extractFirstError(name_validation)


    return {    
        name_validation,

        input_valid_status,
        input_valid
    }
}




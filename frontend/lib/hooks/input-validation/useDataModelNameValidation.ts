import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { InputValidationResult } from "@/lib/interfaces/internal"
import { MAX_LENGTH_DATA_MODEL_NAME } from "./constants"
import { duplicateValidation, validateStringInput } from "./functions"



interface DataModelNameValidation {
    string_validation: InputValidationResult
    duplicate_validation: InputValidationResult
    is_valid: boolean
}

export function useDataModelNameValidation(name: string, data_models: DataModel[]): DataModelNameValidation {

    const string_validation = validateStringInput(name, MAX_LENGTH_DATA_MODEL_NAME)
    const duplicate_validation = duplicateValidation(name, data_models.map((m)=>{return m.name}), "DataModel")

    const is_valid = string_validation.is_valid && duplicate_validation.is_valid

    return {    
        string_validation,
        duplicate_validation,
        is_valid
    }
}




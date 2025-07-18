import { Workflow } from "@/lib/interfaces/WorkflowInteraces";
import { InputValidationResult } from "../../interfaces/internal";
import { extractFirstError, validateDuplicate, validateStringInput } from "./functions";
import { MAX_LENGTH_WORKFLOW_NAME } from "./constants";
import { DataModel } from "@/lib/interfaces/DataModelInterfaces";



interface WorkflowValidation {
    name_validation: InputValidationResult
    llm_validation: InputValidationResult

    input_data_model_validation: InputValidationResult
    output_data_model_validation: InputValidationResult

    input_valid_status: string
    input_valid: boolean
}



interface WorkflowNameValidation {
    name_validation: InputValidationResult
    input_valid_status: string
    input_valid: boolean
}

export function useWorkflowNameValidation(
    name: string,
    workflows: Workflow[]
): WorkflowNameValidation {
    const trimmed_name = name.trim() 

    // call validators
    const name_validation = validateStringInput(trimmed_name, MAX_LENGTH_WORKFLOW_NAME, workflows.map((w)=>{return w.name}))
  

    // compute general is_valid state
    const {input_valid, input_valid_status} = extractFirstError(name_validation)
    
    
    return {
        name_validation, 
        input_valid_status,
        input_valid 
    }
}











export function useWorkflowValidation(
    name: string,
    llm: string | null, 
    workflows: Workflow[],
    input_data_model: DataModel | null | undefined,
    output_data_model: DataModel | null | undefined,
): WorkflowValidation {
    const trimmed_name = name.trim() 

    // call validators
    const name_validation = validateStringInput(trimmed_name, MAX_LENGTH_WORKFLOW_NAME, workflows.map((w)=>{return w.name}))
    const llm_validation = validateLlmInput(llm)
    
    const input_data_model_validation = validateDataModel(input_data_model)
    const output_data_model_validation = validateDataModel(output_data_model)

    // compute general is_valid state
    const {input_valid, input_valid_status} = extractFirstError(name_validation, llm_validation, input_data_model_validation, output_data_model_validation)
    
    
    return {
        name_validation, 
        llm_validation,

        input_data_model_validation,
        output_data_model_validation,

        input_valid_status,
        input_valid 
    }
}

const validateLlmInput = (input: string | null): InputValidationResult => {
    if(input == null){
        return {is_valid: false, msg: "Cannot be empty"}
    }

    const trimmed_input = input.trim() 

    if(trimmed_input.length == 0){
        return {is_valid: false, msg: "Cannot be empty"} 
    }

    return {is_valid: true, msg: "Input is valid"} 
}

const validateDataModel = (data_model : DataModel | null | undefined): InputValidationResult => {
    if(data_model){
        return {is_valid: true, msg: "Input is valid"}
    }
    return {is_valid: false, msg: "Select DataModel"}
}
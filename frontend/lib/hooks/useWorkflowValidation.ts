import { validateWorkflowName, validateWorkflowLLM, validateWorkflowDataModel } from "@/lib/input_validation";
import { InputValidationResult } from "../interfaces/internal";



interface WorkflowValidation {
    name_validation: InputValidationResult;
    llm_validation: InputValidationResult;
    input_model_validation: InputValidationResult;
    output_model_validation: InputValidationResult;
    input_valid: boolean;
}

export function useWorkflowValidation(
    name: string,
    llm: string,
    inputDataModel: any,
    outputDataModel: any
): WorkflowValidation {
    const name_validation = validateWorkflowName(name);
    const llm_validation = validateWorkflowLLM(llm);
    const input_model_validation = validateWorkflowDataModel(inputDataModel, "Input");
    const output_model_validation = validateWorkflowDataModel(outputDataModel, "Output");

    const is_workflow_valid =
        name_validation.is_valid &&
        llm_validation.is_valid &&
        input_model_validation.is_valid &&
        output_model_validation.is_valid;

    return {
        name_validation,
        llm_validation,
        input_model_validation,
        output_model_validation,
        input_valid: is_workflow_valid,
    };
}

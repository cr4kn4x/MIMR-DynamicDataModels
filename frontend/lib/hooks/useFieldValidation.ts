import { DataModelField } from "@/lib/interfaces/DataModelInterfaces";
import { validateDataModelFieldName, validateDataModelFieldType, validateDataModelFieldDescription } from "@/lib/input_validation";
import { InputValidationResult } from "../interfaces/internal";


interface DataModelFieldValidation {
    name_validation: InputValidationResult;
    type_validation: InputValidationResult;
    description_validation: InputValidationResult;
    input_valid: boolean;
}


export function useDataModelFieldValidation(
    name: string,
    type: string,
    description: string | null,
    data_model_fields: DataModelField[]
): DataModelFieldValidation {
    const name_validation = validateDataModelFieldName(name, data_model_fields.map((field) => field.name))

    const type_validation = validateDataModelFieldType(type)

    const description_validation = validateDataModelFieldDescription(description)

    const is_field_valid =
        name_validation.is_valid &&
        type_validation.is_valid &&
        description_validation.is_valid;

    return {
        name_validation,
        type_validation,
        description_validation,
        input_valid: is_field_valid,
    };
}

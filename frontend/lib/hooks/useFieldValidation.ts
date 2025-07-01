import { DataModelField } from "@/lib/interfaces/DataModelInterfaces";
import { validateDataModelFieldName, validateDataModelFieldType, validateDataModelFieldDescription } from "@/lib/input_validation";

interface ValidationResult {
    is_valid: boolean;
    msg: string;
}

interface FieldValidation {
    name_validation: ValidationResult;
    type_validation: ValidationResult;
    description_validation: ValidationResult;
    is_field_valid: boolean;
}

export function useFieldValidation(
    name: string,
    type: string,
    description: string | null,
    data_model_fields: DataModelField[]
): FieldValidation {
    const name_validation = validateDataModelFieldName(name, data_model_fields.map((field) => field.name));
    const type_validation = validateDataModelFieldType(type);
    const description_validation = validateDataModelFieldDescription(description);

    const is_field_valid =
        name_validation.is_valid &&
        type_validation.is_valid &&
        description_validation.is_valid;

    return {
        name_validation,
        type_validation,
        description_validation,
        is_field_valid,
    };
}

import React from "react";
import type { ModelFieldDefinition } from "../../../lib/interfaces/DataModelInterfaces";
import DescriptionDialog from "./DescriptionDialog";
import { Trash2 } from "lucide-react";


interface EditableDataModelField {
    idx: number
    field: ModelFieldDefinition
    onFieldChange: (idx: number, key: keyof ModelFieldDefinition, value: string) => void
    removeDataModelField: (idx: number) => void
}


export function EditableDataModelField(props: EditableDataModelField) {
    return (
        <>
            { /* TYPE SELECTOR */}
            <select className="px-1 rounded bg-gray-900"
                value={props.field.type}
                onChange={e => props.onFieldChange(props.idx, "type", e.target.value)}>
                <option value="str">str</option>
                <option value="int">int</option>
                <option value="float">float</option>
                <option value="bool">bool</option>
            </select>

            {/* FIELD NAME */}
            <input className="px-1 rounded bg-gray-900"
                type="text"
                placeholder="Field"
                value={props.field.name}
                onChange={e => props.onFieldChange(props.idx, "name", e.target.value)}
            />

            {/* FIELD DESCR */}
            <DescriptionDialog
                idx={props.idx}
                description={props.field.description ?? ""}
                onSave={(desc: string) => props.onFieldChange(props.idx, "description", desc)}
                fieldName={props.field.name}
                fieldType={props.field.type}
            />

            {/* DEL FIELD */}
            <button className="disabled:opacity-0" onClick={() => props.removeDataModelField(props.idx)}>
                <Trash2 size={16} />
            </button>
        </>
    )
}
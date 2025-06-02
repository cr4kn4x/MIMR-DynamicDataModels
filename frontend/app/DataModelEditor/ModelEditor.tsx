"use client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { EditableDataModelField } from "./components/EditableDataModelField";
import type { DataModelField, DataModel } from "../../lib/interfaces/DataModelInterfaces";
import { useDataModelEditorContext } from "./PageContext";



export default function DataModelEditor() {

    const [isCollapsed, setIsCollapsed] = useState(false)
    const {data_model_definition, set_data_model_definition} = useDataModelEditorContext()

    
    const handleDataModelFieldChange = (idx: number, key: keyof DataModelField, value: string) => {
        const newFields = data_model_definition.fields.map((f: DataModelField, i: number) =>
            i === idx ? { ...f, [key]: value } : f
        );
        set_data_model_definition({ ...data_model_definition, fields: newFields })
    }

    const addDataModelField = () => {
        set_data_model_definition({
            ...data_model_definition,
            fields: [
                ...data_model_definition.fields,
                { name: "", type: "str", description: null }
            ]
        });
    }

    const removeDataModelField = (idx: number) => {
        set_data_model_definition({
            ...data_model_definition,
            fields: data_model_definition.fields.filter((_: DataModelField, i: number) => i !== idx)
        })
    }

    return (
        <div className="bg-gray-800 rounded-xl p-4 mb-4 relative">
            {/* Collapse Button oben rechts */}
            <button
                className="absolute top-2 right-2 px-1 py-0.5 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs h-6 w-6 flex items-center justify-center"
                style={{ minWidth: '1.5rem', minHeight: '1.5rem', lineHeight: 1 }}
                onClick={() => setIsCollapsed((prev) => !prev)}
                aria-label={isCollapsed ? 'Expand Editor' : 'Collapse Editor'}
            >
                {isCollapsed ? '▼' : '▲'}
            </button>
            {/* Überschrift mittig */}
            <h3 className="text-xl font-bold text-center mb-4">{data_model_definition.name}</h3>
            {!isCollapsed && (
                <>
                    {data_model_definition.fields.map((field: DataModelField, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-3 items-center">
                            <EditableDataModelField 
                                idx={idx} field={field} 
                                onFieldChange={handleDataModelFieldChange}
                                removeDataModelField={removeDataModelField} />
                        </div>
                    ))}
                    {/* ADD FIELD BUTTON */}
                    <button
                        onClick={addDataModelField}
                        className="flex items-center gap-1 mt-2 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
                    >
                        <Plus /> Add Field
                    </button>
                </>
            )}
        </div>
    );
}

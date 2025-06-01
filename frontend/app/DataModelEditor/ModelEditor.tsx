"use client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { EditableDataModelField } from "./components/EditableDataModelField";
import type { ModelFieldDefinition, ModelDefinition } from "../../lib/interfaces/DataModelInterfaces";


export default function DataModelEditor() {

    const [data_model_definition, set_data_model_definition] = useState<ModelDefinition>({
        name: "OverallSentiment",
        fields: [
            {
                name: "sentiment",
                type: "str",
                description: null,
            },
        ],
    });

    const handleDataModelFieldChange = (idx: number, key: keyof ModelFieldDefinition, value: string) => {
        const newFields = data_model_definition.fields.map((f: ModelFieldDefinition, i: number) =>
            i === idx ? { ...f, [key]: value } : f
        );
        set_data_model_definition({ ...data_model_definition, fields: newFields });
    }

    const addDataModelField = () => {
        set_data_model_definition({
            ...data_model_definition,
            fields: [
                ...data_model_definition.fields,
                { name: "", type: "str", description: null }
            ]
        });
    };

    const removeDataModelField = (idx: number) => {
        set_data_model_definition({
            ...data_model_definition,
            fields: data_model_definition.fields.filter((_: ModelFieldDefinition, i: number) => i !== idx)
        });
    };

    return (
        <div>

            <div>
                <h3 className="text-xl font-bold mb-4 text-center">{data_model_definition.name}</h3>

                <div className="bg-gray-800 rounded-xl p-4 mb-4">
                    {data_model_definition.fields.map((field: ModelFieldDefinition, idx: number) => (
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
                        className="flex items-center gap-1 mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
                    >
                        <Plus /> Add Field
                    </button>

                </div>
            </div>

        </div>
    );
}

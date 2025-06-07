import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    FileCodeIcon,
    Edit3Icon,
    Trash2Icon,
    PlusIcon,
    ChevronRightIcon,
} from "lucide-react"
import { EditableDataModelField } from "./EditableDataModelField"
import { useState } from "react"
import { ReadOnlyDataModelField } from "./DataModelField"



interface DataModelCardProps {
    data_model: DataModel


    is_selected: boolean
    onSelect?: () => void
    preview?: boolean // true = nur preview, false = vollständige card mit edit-optionen
    onAddField?: (field: { name: string; type: string; description: string | null }) => void
    onDeleteField?: (fieldId: string) => void
}






export function DataModelCard({ is_selected, data_model, onSelect, preview = false, onAddField, onDeleteField }: DataModelCardProps) {



    return (
        <Card onClick={preview ? onSelect : undefined} className={`transition-all hover:shadow-md ${preview ? (is_selected ? "ring-2 ring-blue-500 bg-blue-50 cursor-pointer" : "cursor-pointer") : "border-1 border-gray-100"}`}>

            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileCodeIcon className="w-4 h-4 text-gray-600" />
                        <CardTitle className="text-sm font-medium">{data_model.name}</CardTitle>

                        {!preview &&
                            <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Edit3Icon className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Trash2Icon className="w-3 h-3" />
                                </Button>
                            </div>
                        }
                    </div>
                    <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                            {data_model.fields.length} fields
                        </Badge>
                    </div>
                </div>
            </CardHeader>


            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Fields
                        </span>
                    </div>

                    <div className="space-y-2">
                        {!preview && data_model.fields.map((field, fieldIndex) => (
                            <div key={field.id} className="group">
                                <EditableDataModelField
                                    field={field}
                                    onSave={(updatedField) => {
                                        console.log("Update field:", field.id, updatedField)
                                    }}
                                    onCancel={() => { }}
                                    onDelete={onDeleteField}
                                />
                            </div>
                        ))}

                        {preview && data_model.fields.map((field, fieldIndex) => (
                            <div key={field.id} className="group">
                                <ReadOnlyDataModelField field={field} />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}





{ /* 



interface DataModelCardProps {
    data_model: DataModel
    is_selected: Boolean
    onSelect?: () => void
    preview?: boolean // true = nur preview, false = vollständige card mit edit-optionen
    onAddField?: (field: { name: string; type: string; description: string | null }) => void
    onDeleteField?: (fieldId: string) => void
}





export function DataModelCard({ is_selected, data_model, onSelect, preview = false, onAddField, onDeleteField }: DataModelCardProps) {

    const DataModelCardHeader = () => {
        return(
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileCodeIcon className="w-4 h-4 text-gray-600" />
                        <CardTitle className="text-sm font-medium">{data_model.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                            {data_model.fields.length} fields
                        </Badge>
                        {!preview && (
                            <ChevronRightIcon
                                className={`w-4 h-4 text-gray-400 transition-transform ${is_selected ? "rotate-90" : ""}`}
                            />
                        )}
                    </div>
                </div>
            </CardHeader>
        )
    }


    



    const [isAddingField, setIsAddingField] = useState(false)

    return (
        <Card key={data_model.name}
            className={`transition-all hover:shadow-md ${
                preview ? (is_selected ? "ring-2 ring-blue-500 bg-blue-50 cursor-pointer" : "cursor-pointer"): "border-2 border-gray-200"}`}
            onClick={preview ? onSelect : undefined}>
            
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileCodeIcon className="w-4 h-4 text-gray-600" />
                        <CardTitle className="text-sm font-medium">{data_model.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                            {data_model.fields.length} fields
                        </Badge>
                        {!preview && (
                            <ChevronRightIcon
                                className={`w-4 h-4 text-gray-400 transition-transform ${is_selected ? "rotate-90" : ""}`}
                            />
                        )}
                    </div>
                </div>
            </CardHeader>

            {is_selected && !preview ? (
                <CardContent className="pt-0">
                    <Separator className="mb-3" />
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Fields
                            </span>
                            <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Edit3Icon className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Trash2Icon className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        {data_model.fields.map((field, fieldIndex) => (
                            <div key={field.id} className="group">
                                <EditableField
                                    field={field}
                                    onSave={(updatedField) => {
                                        // TODO: Update existing field
                                        console.log("Update field:", field.id, updatedField)
                                    }}
                                    onCancel={() => {}}
                                    onDelete={onDeleteField}
                                />
                            </div>
                        ))}

           
                        {isAddingField && (
                            <EditableField
                                isNew={true}
                                onSave={(newField) => {
                                    if (onAddField) {
                                        onAddField(newField)
                                    }
                                    setIsAddingField(false)
                                }}
                                onCancel={() => setIsAddingField(false)}
                            />
                        )}

                        
                        {!isAddingField && (
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="w-full mt-2 h-7 text-xs"
                                onClick={() => setIsAddingField(true)}
                            >
                                <PlusIcon className="w-3 h-3 mr-1" />
                                Add Field
                            </Button>
                        )}
                        
                    </div>
                </CardContent>
            ) : (<></>)
            }
        </Card>
    )
}
*/}
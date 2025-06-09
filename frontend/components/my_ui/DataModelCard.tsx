import { DataModel, DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    FileCodeIcon,
    Edit3Icon,
    Trash2Icon,
    Plus,
} from "lucide-react"
import { EditableDataModelField } from "./EditableDataModelField"
import { ReadOnlyDataModelField } from "./DataModelField"
import { useState } from "react"
import { deleteDataModel } from "@/lib/api/DataModelApi"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"


interface DataModelCardProps {
    project_id: string
    data_model: DataModel
    is_selected: boolean
    onSelect?: () => void
    refresh_data_model(data_model_id: string): void
    refresh_data_model_list(project_id: string): void
    preview: boolean
}


export function DataModelCard({ is_selected, data_model, onSelect, preview, refresh_data_model, refresh_data_model_list, project_id }: DataModelCardProps) {

    const [add_new_field, set_add_new_field] = useState(false)
    const [error, set_error] = useState("")


    async function handle_delete_data_model() {
        try {
            await deleteDataModel(data_model.id)
            refresh_data_model_list(project_id)
            return
        }
        catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            set_error(error_msg)
            return
        }
    }


    return (
        <Card onClick={preview ? onSelect : undefined} className={`transition-all hover:shadow-md ${preview ? (is_selected ? "ring-2 ring-blue-500 bg-blue-50 cursor-pointer" : "cursor-pointer") : "border-1 border-gray-100"}`}>

            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileCodeIcon className="w-4 h-4 text-gray-600" />
                        <CardTitle className="text-sm font-medium">{data_model.name}</CardTitle>

                        {!preview &&
                            <div className="flex space-x-1">

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                            <Trash2Icon className="w-3 h-3" />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Data Model "{data_model.name}"?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. The data model and all associated definitions will be permanently deleted.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={(e) => { e.stopPropagation(); }}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={(e) => { e.stopPropagation(); handle_delete_data_model(); }} className="bg-red-500">Delete Data Model</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Edit3Icon className="w-3 h-3" />
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
                                    refresh_data_model={refresh_data_model}
                                    field={field}
                                    data_model_id={data_model.id}
                                    create_new={false}
                                    create_new_state={set_add_new_field}
                                />
                            </div>)
                        )}

                        {!preview && !add_new_field &&
                            <div className="flex justify-center">
                                <Button size={"sm"} variant={"outline"} onClick={() => { set_add_new_field(true) }}>
                                    <Plus /> Add Field
                                </Button>
                            </div>
                        }

                        {add_new_field &&
                            <EditableDataModelField
                                refresh_data_model={refresh_data_model}
                                field={{ name: "", type: "", description: null, id: "" }}
                                create_new={true}
                                data_model_id={data_model.id}
                                create_new_state={set_add_new_field}
                            />
                        }

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
import { DataModel, DataModelField } from "@/lib/interfaces/DataModelInterfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileCodeIcon, Edit3Icon, Trash2Icon, Plus, Loader2 } from "lucide-react";
import { EditableDataModelField } from "./EditableDataModelField";
import { ReadOnlyDataModelField } from "./DataModelField";
import React, { useState } from "react";
import { deleteDataModel } from "@/lib/api/DataModelApi";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { toast } from "sonner";
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper";


interface FieldListProps {
    fields: DataModelField[];
    preview: boolean;
    data_model_id: string;
    refresh_data_model_list: (project_id: string) => void;
    add_new_field: boolean;
    set_add_new_field: (state: boolean) => void;
}

function FieldList({ fields, preview, data_model_id, refresh_data_model_list, add_new_field, set_add_new_field }: FieldListProps) {
    return (
        <div className="space-y-2">
            {!preview && fields.map((field) => (
                <div key={field.id} className="group">
                    <EditableDataModelField
                        data_model_fields={fields}
                        refresh_data_model={refresh_data_model_list}
                        field={field}
                        data_model_id={data_model_id}
                        create_new={false}
                        create_new_state={set_add_new_field}
                    />
                </div>
            ))}

            {!preview && !add_new_field && (
                <div className="flex justify-center">
                    <Button size={"sm"} variant={"outline"} onClick={() => set_add_new_field(true)}>
                        <Plus /> Add Field
                    </Button>
                </div>
            )}

            {add_new_field && (
                <EditableDataModelField
                    data_model_fields={fields}
                    refresh_data_model={refresh_data_model_list}
                    field={{ name: "", type: "", description: null, id: "" }}
                    create_new={true}
                    data_model_id={data_model_id}
                    create_new_state={set_add_new_field}
                />
            )}

            {preview && fields.map((field) => (
                <div key={field.id} className="group">
                    <ReadOnlyDataModelField field={field} />
                </div>
            ))}
        </div>
    );
}


interface DataModelCardProps {
    project_id: string;
    data_model: DataModel;
    is_selected: boolean;
    onSelect?: () => void;
    refresh_data_model_list(project_id: string): void;
    preview: boolean;
    className?: string;
}


export function DataModelCard({ is_selected, data_model, onSelect, preview, refresh_data_model_list, project_id, className }: DataModelCardProps) {
    const [add_new_field, set_add_new_field] = useState(false);
    const [is_loading, set_is_loading] = useState(false);

    async function delete_data_model() {
        set_is_loading(true);
        await apiCallWrapper(deleteDataModel(data_model.id), toast, "Failed to delete DataModel");
        set_is_loading(false);
    }

    function handle_delete_data_model(e: React.MouseEvent) {
        e.stopPropagation();
        delete_data_model();
    }

    return (
        <div className={cn("relative", className)}>
            {is_loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded shadow-inner cursor-not-allowed">
                    <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
                </div>
            )}
            <Card
                onClick={is_loading ? undefined : (preview ? onSelect : undefined)}
                className={cn(
                    "transition-all hover:shadow-md",
                    preview
                        ? is_selected
                            ? "ring-2 ring-blue-500 bg-blue-50 cursor-pointer"
                            : "cursor-pointer"
                        : "border-1 border-gray-100",
                    is_loading && "pointer-events-none select-none opacity-80"
                )}
            >
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FileCodeIcon className="w-4 h-4 text-gray-600" />
                            <CardTitle className="text-sm font-medium">{data_model.name}</CardTitle>

                            {!preview && (
                                <div className="flex space-x-1">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" disabled={is_loading}>
                                                {is_loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2Icon className="w-3 h-3" />}
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
                                                <AlertDialogCancel disabled={is_loading}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handle_delete_data_model} className="bg-red-500" disabled={is_loading}>Delete Data Model</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" disabled={is_loading}>
                                        <Edit3Icon className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            <Badge variant="secondary" className="text-xs">
                                {data_model.fields.length} fields
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <FieldList
                        fields={data_model.fields}
                        preview={preview}
                        data_model_id={data_model.id}
                        refresh_data_model_list={refresh_data_model_list}
                        add_new_field={add_new_field}
                        set_add_new_field={set_add_new_field}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
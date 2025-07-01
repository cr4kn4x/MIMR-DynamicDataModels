"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CheckIcon, XIcon, Trash2Icon, Edit3Icon, AlertCircle, Loader2 } from "lucide-react"
import { DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import { applyChangesToDataModelField, createNewDataModelField, deleteDataModelField } from "@/lib/api/DataModelApi"
import { useFieldValidation } from "@/lib/hooks/useFieldValidation"


const FIELD_TYPES = [
    { value: "str", label: "String" },
    { value: "int", label: "Integer" },
    { value: "float", label: "Float" },
    { value: "bool", label: "Boolean" },
    { value: "datetime", label: "DateTime" },
    { value: "date", label: "Date" },
    { value: "List[str]", label: "List[str]" },
    { value: "List[int]", label: "List[int]" },
    { value: "Optional[str]", label: "Optional[str]" },
    { value: "Optional[int]", label: "Optional[int]" },
    { value: "Dict[str, Any]", label: "Dict" },
]


interface EditableFieldProps {
    field: DataModelField
    data_model_id: string
    data_model_fields: DataModelField[]
    refresh_data_model(data_model_id: string): void

    create_new: boolean
    create_new_state(state: boolean): void
}


export function EditableDataModelField({ field, data_model_id, data_model_fields, refresh_data_model, create_new, create_new_state }: EditableFieldProps) {
    const [name, set_name] = useState<string>(field.name)
    const [type, set_type] = useState<string>(field.type)
    const [description, set_description] = useState<string | null>(field.description)
    
    // ui states
    const [is_edit, set_is_edit] = useState<boolean>(create_new)
    const [is_loading, set_is_loading] = useState<boolean>(false)
    const [server_error, set_server_error] = useState<string | null>(null)


    const { name_validation, type_validation, description_validation, is_field_valid } = useFieldValidation(name, type, description, data_model_fields)


    const reset_field_states = () => {
        set_name(field.name)
        set_type(field.type)
        set_description(field.description)
    }


    useEffect(()=>{
        if(!is_edit){
            create_new_state(false)
        }
    }, [is_edit])
    

    useEffect(() => {
        // reset server error on change
        if(server_error){
            set_server_error(null)
        }
    }, [name, type, description])

    

    async function save_changes() {
        set_is_loading(true)
        
        try {
            const new_field: DataModelField = {id: field.id, description, name, type}
            
            if(create_new){
                await createNewDataModelField(data_model_id, new_field)
            }
            else{
                await applyChangesToDataModelField(data_model_id, new_field) 
            }

            //  refresh and close editor
            create_new_state(false)
            refresh_data_model(data_model_id)
            cancel_edit_mode()       
        }
        catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            set_server_error(error_msg)
            return
        } 
        finally {
            set_is_loading(false)
        }            
    }

    async function delete_field() {
        set_is_loading(true)
        try {
            await deleteDataModelField(field.id)
            refresh_data_model(data_model_id)
            cancel_edit_mode()
            return
        }
        catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            set_server_error(error_msg)
            return
        }
        finally {
            set_is_loading(false)
        }
    }


    function enter_edit_mode(){
        reset_field_states()
        set_is_edit(true)
    }    
    
    function cancel_edit_mode(){
        reset_field_states() 
        set_is_edit(false)
    }


    return (
        <div className="group">
            {!is_edit &&
                <div className="grid grid-cols-[160px_30px_1fr_auto] gap-3 items-center text-xs bg-gray-50 rounded px-2 py-1 hover:bg-gray-100 cursor-pointer transition-colors">

                    {/* 160px */}
                    <div className="truncate">
                        <span className="font-medium">{field.name}</span>
                    </div>

                    {/* 30px */}
                    <div>
                        <Badge variant="outline">{field.type}</Badge>
                    </div>

                    {/* 1fr takes the rest */}
                    <div className="text-gray-600">
                        {field.description ? (
                            <p className="truncate">{field.description}</p>
                        ) : (
                            <p className="italic">No description</p>
                        )}
                    </div>

                    {/* auto width - as much as needed */}
                    <div className="flex space-x-1">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-red-500">
                                    <Trash2Icon />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete field "{field.name}"?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. The field and all associated definitions will be permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={ delete_field } className="bg-red-500">Delete Field</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                        <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-green-800"
                            onClick={ enter_edit_mode }>
                            <Edit3Icon />
                        </Button>
                    </div>
                </div>
            }

            {is_edit &&
                <div className="space-y-2 p-2 bg-white rounded border border-blue-200 shadow">
                    <div className="flex gap-1">
                        <div className="flex flex-col w-full">
                            <Input 
                                placeholder="Field name" 
                                value={name} 
                                onChange={(e) => set_name(e.target.value)} 
                                className={
                                    !name_validation.is_valid
                                        ? "border-red-500 ring-1 ring-red-300"
                                        : ""
                                }
                                disabled={is_loading}
                            />
                            {!name_validation.is_valid && (
                                <span className="text-xs text-red-500 mt-0.5 ml-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {name_validation.msg}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col w-44">
                            <Select value={type} onValueChange={(value) => set_type(value)} disabled={is_loading}>
                                <SelectTrigger className="h-7 w-44">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {FIELD_TYPES.map((fieldType) => (
                                        <SelectItem key={fieldType.value} value={fieldType.value}>
                                            {fieldType.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <Textarea
                            placeholder="Description (optional)"
                            value={description ? (description) : ("")}
                            onChange={(e) => set_description(e.target.value)}
                            className={`text-xs overflow-hidden h-fit ${
                                !description_validation.is_valid
                                    ? "border-red-500 ring-1 ring-red-300"
                                    : ""
                            }`}
                            disabled={is_loading}
                        />
                    </div>

                    {/* Validation/Error/Success messages */}
                    <div className="min-h-[22px]">
                        {(server_error) && (
                            <div className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {server_error}
                            </div>
                        )}
                    </div>

                    <div>
                        {/* Save/Cancel buttons on the right */}
                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={ cancel_edit_mode } disabled={is_loading}>
                                <XIcon />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={save_changes} disabled={!is_field_valid || is_loading}>
                                {is_loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckIcon />}
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
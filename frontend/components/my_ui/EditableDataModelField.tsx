"use client"
import { useState, useEffect, useRef } from "react"
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
import { CheckIcon, XIcon, Trash2Icon, Edit3Icon, UndoIcon, RedoIcon, RotateCcwIcon } from "lucide-react"
import { DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import { applyChangesToDataModelField } from "@/lib/api/DataModelApi"


interface EditableFieldProps {
    field: DataModelField
    data_model_id: string
}


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


export function EditableDataModelField({ field, data_model_id }: EditableFieldProps) {

    // 
    const [name, set_name] = useState<string>(field.name)
    const [type, set_type] = useState<string>(field.type)
    const [description, set_description] = useState<string | null>(field.description)
    

    // ui states
    const [is_edit, set_is_edit] = useState<boolean>(false)
    const [active_changes, set_active_changes] = useState<boolean>(false)

    // history for undo/redo
    const [history, setHistory] = useState<Array<{name: string, type: string, description: string | null}>>([])
    const [historyIndex, setHistoryIndex] = useState<number>(-1)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isUndoRedoAction = useRef<boolean>(false)

    // 
    const [error, set_error] = useState("")


    async function handle_save_changes() {
        // show toast if failed
        try {
            const new_field: DataModelField = {id: field.id, description: description, name: name, type: type}
            await applyChangesToDataModelField(data_model_id, new_field)
            
            cancelEditMode()
            return
        }
        catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            set_error(error_msg)
            return
        }
    }


    function handle_delete_field() {
        // show toast if failed / success
    }


    useEffect(() => {
        const hasNameChanged = name !== field.name
        const hasTypeChanged = type !== field.type
        const hasDescriptionChanged = description !== field.description

        set_error("")
        
        set_active_changes(hasNameChanged || hasTypeChanged || hasDescriptionChanged)

        // Schedule history save - but only if NOT an undo/redo action
        if (!isUndoRedoAction.current) {
            // Debounced history saving
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
            saveTimeoutRef.current = setTimeout(() => {
                saveToHistory()
            }, 1000) // Save to history after 1 second of no changes
        }
    }, [name, type, description])

    function saveToHistory() {
        const currentState = { name, type, description }
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(currentState)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
    }

    function undo() {
        if (historyIndex > 0) {
            isUndoRedoAction.current = true
            
            const prevState = history[historyIndex - 1]
            set_name(prevState.name)
            set_type(prevState.type)
            set_description(prevState.description)
            setHistoryIndex(historyIndex - 1)
            
            // Reset the flag after state updates
            setTimeout(() => {
                isUndoRedoAction.current = false
            }, 0)
        }
    }

    function redo() {
        if (historyIndex < history.length - 1) {
            isUndoRedoAction.current = true
            
            const nextState = history[historyIndex + 1]
            set_name(nextState.name)
            set_type(nextState.type)
            set_description(nextState.description)
            setHistoryIndex(historyIndex + 1)
            
            // Reset the flag after state updates
            setTimeout(() => {
                isUndoRedoAction.current = false
            }, 0)
        }
    }

    const canUndo = historyIndex > 0
    const canRedo = historyIndex < history.length - 1
    
    function resetToOriginal() {
        // Reset to original field values
        set_name(field.name)
        set_type(field.type)
        set_description(field.description)

        // Clear history and start fresh
        const initialState = { name: field.name, type: field.type, description: field.description }
        setHistory([initialState])
        setHistoryIndex(0)

        // Clear any pending save timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        set_error("")
        set_active_changes(false)
    }

    


    function enterEditMode() {
        resetToOriginal()

        // Initialize history with current field state
        const initialState = { name: field.name, type: field.type, description: field.description }
        setHistory([initialState])
        setHistoryIndex(0)

        set_active_changes(false)
        set_is_edit(true)
    }

    function cancelEditMode(){
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
                                    <AlertDialogCancel onClick={(e) => { e.stopPropagation(); }}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={(e) => { e.stopPropagation(); handle_delete_field(); }} className="bg-red-500">Delete Field</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                        <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-green-800"
                            onClick={(e) => { e.stopPropagation(); enterEditMode(); }}>
                            <Edit3Icon />
                        </Button>
                    </div>
                </div>
            }

            {is_edit &&
                <div className="space-y-2 p-2 bg-white rounded border border-blue-200 shadow">

                    <div className="flex gap-1">
                        <Input 
                            placeholder="Field name" 
                            value={name} 
                            onChange={(e) => set_name(e.target.value)} 
                            className={name !== field.name ? "ring-1 ring-blue-200 border-blue-200" : ""}
                        />

                        <Select value={type} onValueChange={(value) => set_type(value)}>
                            <SelectTrigger className={`h-7 w-44 ${type !== field.type ? "ring-1 ring-blue-200 border-blue-200" : ""}`}>
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

                    <Textarea
                        placeholder="Description (optional)"
                        value={description ? (description) : ("")}
                        onChange={(e) => set_description(e.target.value)}
                        className={`text-xs overflow-hidden h-fit ${description !== field.description ? "ring-1 ring-blue-200 border-blue-200" : ""}`}
                    />

                    <div className="flex justify-between gap-1">
                        {/* Undo/Redo buttons on the left */}
                        <div className="flex gap-1">
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="hover:text-blue-500 h-6 w-6" 
                                disabled={!canUndo}
                                onClick={(e) => { e.stopPropagation(); undo(); }}
                                title="Undo"
                            >
                                <UndoIcon />
                            </Button>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="hover:text-blue-500 h-6 w-6" 
                                disabled={!canRedo}
                                onClick={(e) => { e.stopPropagation(); redo(); }}
                                title="Redo"
                            >
                                <RedoIcon />
                            </Button>
                    
                            {active_changes ? (
                                <div className="px-5">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon" 
                                            variant="ghost" 
                                            className="hover:text-orange-500 h-6 w-6" 
                                            title="Reset to original"
                                        >
                                            <RotateCcwIcon />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Reset to original values?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action will discard all changes and reset the field to its original state. The editor will remain open.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={(e) => { e.stopPropagation(); }}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={(e) => { e.stopPropagation(); resetToOriginal(); }} className="bg-orange-500">Reset</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                            ) : (
                                <div className="px-5">
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="hover:text-orange-500 h-6 w-6" 
                                    disabled={true}
                                    title="Reset to original"
                                >
                                    <RotateCcwIcon />
                                </Button>
                                </div>
                            )}
                        </div>

                        {/* Save/Cancel buttons on the right */}
                        <div className="flex gap-1">
                        {active_changes ? (
                            <>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="icon" variant="ghost" className="hover:text-red-500">
                                            <XIcon />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Close editor without saving?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. All changes will be discarded.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={(e) => { e.stopPropagation(); }}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={(e) => { e.stopPropagation(); cancelEditMode() }} className="bg-red-500">Discard changes</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>



                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="icon" variant="ghost" className="hover:text-green-500" disabled={!name.trim() || !type}>
                                            <CheckIcon />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Save changes?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action will save the model
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction onClick={(e) => { e.stopPropagation(); }} className="bg-red-500">Cancel</AlertDialogAction>
                                            <AlertDialogCancel onClick={(e) => { e.stopPropagation(); handle_save_changes() }} className="">Save</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        ) : (
                            <>
                                <Button size="icon" variant="ghost" className="hover:text-red-500" onClick={(e)=>{e.stopPropagation(); cancelEditMode()}}>
                                    <XIcon />
                                </Button>
                                <Button size="icon" variant="ghost" className="hover:text-green-500" disabled={!name.trim() || !type} onClick={(e)=>{e.stopPropagation(); cancelEditMode()}}>
                                    <CheckIcon />
                                </Button>
                            </>
                        )
                        }
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-xs">{error}</div>}
                    
                    {active_changes && (
                        <div className="text-xs text-gray-500 italic mt-1">
                            Unsaved changes
                        </div>
                    )}
                </div>
            }
        </div>
    )
}
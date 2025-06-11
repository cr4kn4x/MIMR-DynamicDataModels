import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { createNewDataModel } from "@/lib/api/DataModelApi"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { validateDataModelName, MAX_LENGTH_DATA_MODEL_NAME } from "@/lib/input_validation"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"

interface CreateDataModelDialogProps {
    selected_project_id: string
    data_models: DataModel[]
    refresh_data_models_list(project_id: string): void
}


export default function CreateDataModelDialog({selected_project_id, data_models, refresh_data_models_list}: CreateDataModelDialogProps) {
    // 
    const [dialog_open, set_dialog_open] = useState<boolean>(false)
    const [data_model_name, set_data_model_name] = useState<string>("")
    const [is_loading, set_is_loading] = useState<boolean>(false)
    const [server_error, set_server_error] = useState<string | null>(null)

    const reset_all_states = () => {
        set_dialog_open(false)
        set_is_loading(false)
        set_server_error(null)
        set_data_model_name("")
    }


    async function handle_create_new_data_model(selected_project_id: string, data_model_name: string) {
        set_is_loading(true)

        
        try {
            await createNewDataModel(selected_project_id, data_model_name)

            toast.success("Data model created successfully", {
                richColors: true,
            })

            // reset and close 
            reset_all_states()

            // refresh data models in the selected project
            refresh_data_models_list(selected_project_id)
        }
        catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            set_server_error(error_msg)
            return false
        }

        finally{
            set_is_loading(false)
        }
    }

    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        set_server_error(null)

        await handle_create_new_data_model(selected_project_id, data_model_name)
    }

    
    // computed variable
    const validation = validateDataModelName(data_model_name, data_models.map((data_model) => {return data_model.name}))
    
    useEffect(()=>{
        if(server_error){set_server_error(null)}
    }, [data_model_name])

    return (
        <Dialog open={dialog_open} onOpenChange={(open) => {
            set_dialog_open(open)
            if (!open) {
                reset_all_states()
            }
        }}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                        <PlusIcon/>
                        Data Model
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Data Model</DialogTitle>
                    <DialogDescription>
                        Create a new data model.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="data-model-name">Data Model Name</Label>
                            <Input 
                                id="data-model-name" 
                                placeholder="Enter data model name..."
                                value={data_model_name} 
                                onChange={e => { 
                                    set_data_model_name(e.target.value); 
                                    set_server_error(null); 
                                }} 
                                className={
                                    !validation.is_valid ? "border-yellow-500 focus-visible:ring-yellow-500" 
                                    : validation.is_valid && !server_error && data_model_name.trim() ? "border-green-500" 
                                    : server_error ? "border-red-500" : ""
                                }
                                disabled={is_loading}
                                autoFocus
                                maxLength={50}
                            />
                            {/* Validation & Error Messages */}
                            {(!validation.is_valid || server_error) && (
                                <div className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {server_error ? server_error : validation.msg}
                                </div>
                            )}
                            {validation.is_valid && !server_error && data_model_name.trim() && (
                                <div className="text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {validation.msg}
                                </div>
                            )}
                            {/* Character Counter */}
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{data_model_name.length}/{MAX_LENGTH_DATA_MODEL_NAME} characters</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={is_loading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={is_loading || !validation.is_valid}>
                            {is_loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Create Data Model
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
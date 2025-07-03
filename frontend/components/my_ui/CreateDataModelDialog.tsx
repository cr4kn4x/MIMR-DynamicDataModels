import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { createNewDataModel } from "@/lib/api/DataModelApi"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { useDataModelNameValidation } from "@/lib/hooks/input-validation/useDataModelNameValidation"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"
import { MAX_LENGTH_DATA_MODEL_NAME } from "@/lib/hooks/input-validation/constants"
import InputValidationStatus from "./InputValidationStatus"

interface CreateDataModelDialogProps {
    selected_project_id: string
    data_models: DataModel[]
    refresh_data_models(): void
}


export default function CreateDataModelDialog({selected_project_id, data_models, refresh_data_models}: CreateDataModelDialogProps) {
    // 
    const [dialog_open, set_dialog_open] = useState<boolean>(false)
    const [data_model_name, set_data_model_name] = useState<string>("")
    const [is_loading, set_is_loading] = useState<boolean>(false)
    

    useEffect(()=>{
        if(!dialog_open){
            set_is_loading(false)
            set_data_model_name("")
        }
    }, [dialog_open])

    async function handle_create_new_data_model(selected_project_id: string, data_model_name: string) {
        set_is_loading(true)

        
        const res = await apiCallWrapper(createNewDataModel(selected_project_id, data_model_name), toast, "Failed to create DataModel")

        if(res && res == true){
            set_dialog_open(false)
            refresh_data_models()
            toast.success("DataModel created ", {richColors: true})
        }   
    }

    
    async function handle_submit(e: React.FormEvent) {
        e.preventDefault()
        await handle_create_new_data_model(selected_project_id, data_model_name)
    }

    
    // computed variable
    const {input_valid_status, input_valid} = useDataModelNameValidation(data_model_name, data_models)
    
    

    return (
        <Dialog open={dialog_open} onOpenChange={(open) => {set_dialog_open(open)}}>
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
                <form onSubmit={handle_submit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="data-model-name">Data Model Name</Label>
                            <Input 
                                id="data-model-name" 
                                placeholder="Enter data model name..."
                                value={data_model_name} 
                                onChange={e => {set_data_model_name(e.target.value)}} 
                                disabled={is_loading}
                                autoFocus
                                maxLength={50}
                            />
                            
                            <InputValidationStatus input_valid={input_valid} status={input_valid_status} />

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
                        <Button type="submit" disabled={is_loading || !input_valid}>
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
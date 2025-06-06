import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createNewDataModel, createNewProject } from "@/lib/api/DataModelApi"
import { PlusIcon } from "lucide-react"




interface CreateDataModelDialogProps {
    selected_project_id: string
}


export default function CreateDataModelDialog({selected_project_id}: CreateDataModelDialogProps) {
    // initialize component states
    const [dialog_open, set_dialog_open] = useState<boolean>(false)
    const [data_model_name, set_data_model_name] = useState("")
    const [error, setError] = useState<string | null>(null)


    async function handle_create_new_data_model(selected_project_id: string, data_model_name: string) {
        if (!data_model_name.trim()) {
            setError("Name cannot be emtpy!")
            return false
        }

        try {
            await createNewDataModel(selected_project_id, data_model_name)
        }
        catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            setError(error_msg)
            return false
        }

        setError(null)
        return true
    }

    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (await handle_create_new_data_model(selected_project_id, data_model_name)) {
            set_data_model_name("");
            set_dialog_open(false)
        }
    }

    return (
        <Dialog open={dialog_open} onOpenChange={set_dialog_open}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Data Model
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
                                    setError(null); 
                                }} 
                                className={error ? "border-red-500" : ""}
                            />
                            {error && (
                                <span className="text-sm text-red-500 mt-1 flex items-center">
                                    {error}
                                </span>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={!data_model_name.trim()}>
                            Create Data Model
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
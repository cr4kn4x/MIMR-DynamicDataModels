import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { createNewProject } from "@/lib/api/DataModelApi"
import { toast } from "sonner"
import { Loader2, FolderPlus, AlertCircle, CheckCircle } from "lucide-react"

import { Project } from "@/lib/interfaces/DataModelInterfaces"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"
import { useProjectNameValidation } from "@/lib/hooks/input-validation/useProjectNameValidation"
import { MAX_LENGTH_PROJECT_NAME } from "@/lib/hooks/input-validation/constants"
import InputValidationStatus from "./InputValidationStatus"



interface CreateDialogProps {
    refresh_projects_list(): void
    projects: Project[]
}


export default function CreateProjectDialog({ projects, refresh_projects_list }: CreateDialogProps) {
    //
    const [dialog_open, set_dialog_open] = useState<boolean>(false)
    const [project_name, set_project_name] = useState<string>("")
    const [is_loading, set_is_loading] = useState<boolean>(false)

    //
    const {input_valid, input_valid_status} = useProjectNameValidation(project_name, projects)


    useEffect(()=>{
        if(!dialog_open){
            set_is_loading(false)
            set_project_name("")
        }
    }, [dialog_open])


    async function handle_create_new_project(project_name: string) {
        set_is_loading(true)

        const res = await apiCallWrapper(createNewProject(project_name.trim()), toast, "Failed to create new Project")
        if(res && res == true){refresh_projects_list(); set_dialog_open(false)}

        set_is_loading(false)
    }


    async function handle_submit(e: React.FormEvent) {
        e.preventDefault()
        await handle_create_new_project(project_name)
    }


    return (
        <Dialog open={dialog_open} onOpenChange={(open) => {set_dialog_open(open)}}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="justify-start w-full gap-2 hover:bg-accent">
                    <FolderPlus className="h-4 w-4" />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderPlus className="h-5 w-5" />
                        Create New Project
                    </DialogTitle>
                    <DialogDescription>
                        Create a new project to organize your Pydantic data models. Projects help you group related models together for better organization.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handle_submit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-project-name" className="text-sm font-medium">
                                Project Name
                            </Label>
                            <Input
                                id="new-project-name"
                                placeholder="Enter a descriptive project name..."
                                value={project_name}
                                onChange={(e) => { set_project_name(e.target.value) }}
                                disabled={is_loading}
                                autoFocus
                                maxLength={50}
                            />

                            <InputValidationStatus input_valid={input_valid} status={input_valid_status} />

                            {/* Character Counter */}
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{project_name.length}/{MAX_LENGTH_PROJECT_NAME} characters</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={is_loading}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={is_loading || !input_valid}>
                            {is_loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FolderPlus className="mr-2 h-4 w-4" />
                                    Create Project
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

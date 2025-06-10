import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { createNewProject } from "@/lib/api/DataModelApi"
import { toast } from "sonner"
import { Loader2, FolderPlus, AlertCircle, CheckCircle } from "lucide-react"
import { MAX_LENGTH_PROJECT_NAME, validateProjectName } from "@/lib/input_validation"
import { Project } from "@/lib/interfaces/DataModelInterfaces"



interface CreateDialogProps {
    refresh_projects_list(): void
    projects: Project[]
}


export default function CreateProjectDialog({ projects, refresh_projects_list }: CreateDialogProps) {
    //
    const [dialog_open, set_dialog_open] = useState<boolean>(false)
    const [project_name, set_project_name] = useState<string>("")
    const [is_loading, set_is_loading] = useState<boolean>(false)
    const [server_error, set_server_error] = useState<string | null>(null)

    const reset_all_states = () => {
        set_dialog_open(false)
        set_project_name("")
        set_is_loading(false)
        set_server_error(null)
    }

    async function handle_create_new_project(project_name: string) {
        set_is_loading(true)
        
        // validateProjectName(project_name, projects.map((project) => {return project.name}))
        try {
            await createNewProject(project_name.trim())
            toast.success("Project created successfully", {
                richColors: true,
            })

            // reset and close
            reset_all_states()

            // refresh projects list
            refresh_projects_list()
            return true
        }
        catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            set_server_error(error_msg)
            return false
        }
        finally {
            set_is_loading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        set_server_error(null)

        await handle_create_new_project(project_name)
    }



    // computed variable
    const validation = validateProjectName(project_name, projects.map((project) => {return project.name}))

    useEffect(() => {
        if(server_error){set_server_error(null)}      
    }, [project_name])


    return (
        <Dialog open={dialog_open} onOpenChange={(open) => {
            set_dialog_open(open)
            if(!open){
                reset_all_states()
            }
        }}>
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
                
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-project-name" className="text-sm font-medium">
                                Project Name
                            </Label>
                            <Input 
                                id="new-project-name" 
                                placeholder="Enter a descriptive project name..."
                                value={project_name} 
                                onChange={(e)=>{set_project_name(e.target.value)}}
                                className={
                                    !validation.is_valid ? "border-yellow-500 focus-visible:ring-yellow-500" 
                                    : validation.is_valid && !server_error && project_name.trim() ? "border-green-500" 
                                    : server_error ? "border-red-500" : ""
                                }   
                                disabled={is_loading}
                                autoFocus
                                maxLength={50}
                            />
                            
                            {/* Validation Messages */}
                            {(!validation.is_valid || server_error) && (
                                <div className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {
                                        server_error ? (server_error): (validation.msg)
                                    }
                                </div>
                            )}

                            {validation.is_valid && !server_error && project_name.trim() && (
                                <div className="text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {validation.msg}
                                </div>
                            )}
                            
                            {/* Character Counter */}
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{project_name.length}/{MAX_LENGTH_PROJECT_NAME} characters</span>
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <DialogClose>
                            <Button variant="outline" type="button" disabled={is_loading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        
                        <Button type="submit" disabled={is_loading || !validation.is_valid}>
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

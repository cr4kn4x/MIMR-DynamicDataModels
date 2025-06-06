import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createNewProject } from "@/lib/api/DataModelApi"


export default function CreateProjectDialog() {
    // initialize component states
    const [dialog_open, set_dialog_open] = useState<boolean>(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [error, setError] = useState<string | null>(null)


    async function handle_create_new_project(project_name: string) {
        if (!project_name.trim()) {
            setError("Name cannot be emtpy!")
            return false
        }

        try {
            await createNewProject(project_name)
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

        if (await handle_create_new_project(newProjectName)) {
            setNewProjectName("");
            set_dialog_open(false)
        }
    }

    return (
        <Dialog open={dialog_open} onOpenChange={set_dialog_open}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="justify-start w-full">
                    + New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Create a new project to organize your Pydantic data models.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-project-name">Project Name</Label>
                            <Input 
                                id="new-project-name" 
                                placeholder="Enter project name..."
                                value={newProjectName} 
                                onChange={e => { 
                                    setNewProjectName(e.target.value); 
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
                        <Button type="submit" disabled={!newProjectName.trim()}>
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
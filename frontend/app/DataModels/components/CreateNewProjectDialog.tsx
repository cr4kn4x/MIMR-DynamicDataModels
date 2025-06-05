import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createNewProject } from "@/lib/api/DataModelApi"


export default function CreateNewProjectDialog() {
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
        <Dialog open={dialog_open}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={()=>{set_dialog_open(true)}}>new project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new project</DialogTitle>
                </DialogHeader>
                <DialogDescription> </DialogDescription>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-1">
                            <Label htmlFor="new-project-name">Project Name</Label>
                            <Input id="new-project-name" name="project name" value={newProjectName} onChange={e => { setNewProjectName(e.target.value); setError(null); }} />
                            {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
                        </div>
                    </div>
                    <DialogFooter className="pt-2">
                        <DialogClose asChild>
                            <Button variant="destructive" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
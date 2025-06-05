import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";


interface FieldDescriptionDialogProps {
    description: string
}


export function FieldDescriptionDialog( {description}: FieldDescriptionDialogProps ) {

    const [draft_description, set_draft_description] = useState<string>(description)
    

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Input className="truncate block" value={draft_description}/>
            </DialogTrigger>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit description of Field  
                    </DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <textarea className="w-full rounded p-1" value={draft_description}/>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="destructive">Discard</Button>
                        <Button>Save changes</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper";
import { createWorkflowAccessToken } from "@/lib/api/WorkflowApi";
import CopyButton from "./CopyButton";





interface CreateWorkflowApiKeyDialogProps {
    workflow_id: string | null
}




export default function CreateWorkflowApiKeyDialog({ workflow_id }: CreateWorkflowApiKeyDialogProps) {
    const [name, set_name] = useState<string>("");
    const [open, set_open] = useState(false);
    const [api_key, set_api_key] = useState<string | null>(null);
    const [loading, set_loading] = useState(false);

    const handle_create_new_access_token = async () => {
        if (!workflow_id) { toast.error("Error"); return; }
        set_loading(true);
        const res = await apiCallWrapper(createWorkflowAccessToken(workflow_id, name), toast, "Failed to create Access Token");
        set_loading(false);
        if (res && res.api_key) {
            set_api_key(res.api_key);
        }
    };
    
    const reset = () => {
        set_name("")
        set_open(false)
        set_api_key(null)
        set_loading(false)
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            set_open(isOpen);
            if (!isOpen) {
                reset();
            }
        }}>
            <DialogTrigger asChild>
                <Button> <PlusCircleIcon /> Create Access Token</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-semibold">Create Access Token</DialogTitle>
                </DialogHeader>

                {api_key ? (
                    <div className="flex flex-col gap-2 items-center">
                        <div className="flex items-center">
                            <div className="bg-muted p-1 rounded w-full text-center flex">
                                <p className="font-mono break-all text-sm">{api_key}</p>
                            </div>
                            <div onClick={() => { reset() }}>
                                <CopyButton value={api_key} toaster={toast} value_name="Access Token" />
                            </div>

                        </div>

                        <span className="text-sm text-muted-foreground">Please copy this key now. You won't be able to see it again!</span>
                        <DialogFooter>
                            <Button onClick={() => set_open(false)}>Close</Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handle_create_new_access_token();
                        }}
                    >
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Access Token Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={e => set_name(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" type="button" disabled={loading}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading || !name}>
                                {loading ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
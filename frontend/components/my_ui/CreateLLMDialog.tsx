import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, AlertCircle, CheckCircle, PlusIcon } from "lucide-react"
import { addLlm } from "@/lib/api/WorkflowApi"

interface CreateLLMDialogProps {
    refresh_llm_list_trigger?: () => void
}

export default function CreateLLMDialog({ refresh_llm_list_trigger }: CreateLLMDialogProps) {

    const [alias, set_alias] = useState<string>("")
    const [model_name, set_model_name] = useState<string>("")
    const [base_url, set_base_url] = useState<string>("")
    const [api_key, set_api_key] = useState<string>("")

    const [dialog_open, set_dialog_open] = useState(false)
    const [is_loading, set_is_loading] = useState(false)
    const [server_error, set_server_error] = useState<string | null>(null)

    const reset_all_states = () => {
        set_dialog_open(false)
        set_is_loading(false)
        set_server_error(null)

        set_alias("")
        set_model_name("")
        set_base_url("")
        set_api_key("")
    }

    async function handle_create_llm() {
        set_is_loading(true)
        try {
            await addLlm(alias, model_name, base_url, api_key)
            toast.success("LLM added successfully", { richColors: true })
            reset_all_states()

            if(refresh_llm_list_trigger){
                refresh_llm_list_trigger()
            }
        } catch (e) {
            const error_msg = e instanceof Error ? e.message : String(e)
            set_server_error(error_msg)
            return false
        } finally {
            set_is_loading(false)
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        set_server_error(null)
        handle_create_llm()
    }

    return (
        <Dialog open={dialog_open} onOpenChange={(open) => {
            set_dialog_open(open)
            if (!open) reset_all_states()
        }}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <PlusIcon />
                    Add LLM
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Large Language Model</DialogTitle>
                    <DialogDescription>
                        Register a new OpenAI-compatible LLM endpoint.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="llm-name">LLM Name</Label>
                            <Input id="llm-name" placeholder="Enter a alias for the llm" value={alias} onChange={e => set_alias(e.target.value)} disabled={is_loading} required />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="llm-name">Model Name</Label>
                            <Input id="llm-name" placeholder="For example: Qwen/Qwen3-14B" value={model_name} onChange={e => set_model_name(e.target.value)} disabled={is_loading} required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="api-url">API URL</Label>
                            <Input id="api-url" placeholder="https://api.example.com/v1/chat/completions" value={base_url} onChange={e => set_base_url(e.target.value)} disabled={is_loading} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <Input id="api-key" placeholder="sk-..." value={api_key} onChange={e => set_api_key(e.target.value)} disabled={is_loading} required type="password" />
                        </div>
                        
                        {server_error && (
                            <div className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {server_error}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={is_loading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={is_loading}>
                            {is_loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add LLM
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

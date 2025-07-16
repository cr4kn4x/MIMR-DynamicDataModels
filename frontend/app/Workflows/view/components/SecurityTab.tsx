
import { Card } from "@/components/ui/card";
import { viewWorkflowPageContext } from "../../create/PageContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CopyButton from "@/components/my_ui/CopyButton";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DotsHorizontalIcon, DotsVerticalIcon, InfoCircledIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper";
import { createWorkflowAccessToken, deleteWorkflowAccessToken, refreshWorkflowAccessToken } from "@/lib/api/WorkflowApi";
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { PlusCircleIcon, PlusSquareIcon } from "lucide-react";
import CreateWorkflowApiKeyDialog from "@/components/my_ui/CreateApiKeyDialog";

import { useRef } from "react";
import { Separator } from "@/components/ui/separator";

export default function SecurityTab() {
    const { selected_workflow_populated, workflow_api_keys } = viewWorkflowPageContext();
    const [loadingKeyId, setLoadingKeyId] = useState<string | null>(null);
    const [showTokenDialog, setShowTokenDialog] = useState(false);
    const [newToken, setNewToken] = useState<string | null>(null);

    const handle_delete_api_key = async (key_id: string) => {
        setLoadingKeyId(key_id + "-delete");
        const res = await apiCallWrapper(deleteWorkflowAccessToken(key_id), toast, "Failed to delete Access Token");
        setLoadingKeyId(null);
        // Optional: Hier könntest du ein Refresh der Keys triggern, falls nicht automatisch
    };

    const handle_refresh_api_key = async (key_id: string) => {
        setLoadingKeyId(key_id + "-refresh");
        const res = await apiCallWrapper(refreshWorkflowAccessToken(key_id), toast, "Failed to regenerate Access Token");
        setLoadingKeyId(null);
        if (res && res.api_key) {
            setNewToken(res.api_key);
            setShowTokenDialog(true);
        }
    };

    return (
        <div className="w-full p-4">
            {/* Dialog für neuen Token nach Refresh */}
            <Dialog open={showTokenDialog} onOpenChange={(isOpen) => {
                setShowTokenDialog(isOpen);
                if (!isOpen) setNewToken(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-semibold">Neuer Access Token</DialogTitle>
                    </DialogHeader>
                    {newToken && (
                        <div className="flex flex-col gap-2 items-center">
                            <div className="flex items-center">
                                <div className="bg-muted p-1 rounded w-full text-center flex">
                                    <p className="font-mono break-all text-sm">{newToken}</p>
                                </div>
                                <div>
                                    <CopyButton value={newToken} toaster={toast} value_name="Access Token" />
                                </div>
                            </div>
                            <span className="text-sm text-muted-foreground">Bitte kopiere diesen Token jetzt. Du kannst ihn später nicht mehr einsehen!</span>
                            <DialogFooter>
                                <Button onClick={() => setShowTokenDialog(false)}>Schließen</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            {(selected_workflow_populated) ? (
                <div>
                    <div className="w-full grid grid-cols-3 gap-5">

                        <div className="col-span-3">


                            <div className="flex items-center gap-2">
                                <div className="flex items-start gap-2 border border-yellow-200 rounded-md bg-yellow-50 p-2 w-full">
                                    <InfoCircledIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
                                    <p className="text-xs font-normal text-gray-700 leading-relaxed">
                                        <span className="font-semibold text-yellow-700">Access Tokens (API-Keys):</span> grant external applications access to this workflow and allow the execution of paid actions.<br />
                                        <span className="font-normal">Please handle your tokens with care: never share them publicly, store them securely, and rotate them regularly to prevent unauthorized access.</span>
                                    </p>
                                </div>
                                <div className="ml-1">
                                    <CreateWorkflowApiKeyDialog workflow_id={selected_workflow_populated.id} />
                                </div>
                            </div>

                            <Table className="mt-4 text-xs">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>API-Key</TableHead>
                                        <TableHead>Last Refresh Date</TableHead>
                                        <TableHead>Last Used Date</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workflow_api_keys.map((h, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{h.name}</TableCell>
                                            <TableCell>{h.api_key_preview}</TableCell>
                                            <TableCell>{h.last_refreshed_at ? new Date(h.last_refreshed_at).toLocaleString() : "-"}</TableCell>
                                            <TableCell>{h.last_used_at ? new Date(h.last_used_at).toLocaleString() : "-"}</TableCell>
                                            <TableCell>
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <Button size={"sm"}>
                                                            <DotsVerticalIcon />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent align="start" className="w-auto p-2">
                                                        <div className="flex flex-col gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="justify-start"
                                                                onClick={() => handle_refresh_api_key(h.id)}
                                                                disabled={loadingKeyId === h.id + "-refresh"}
                                                            >
                                                                <ReloadIcon className="mr-1 h-4 w-4 animate-spin" style={{ display: loadingKeyId === h.id + "-refresh" ? "inline-block" : "none" }} />
                                                                <ReloadIcon className="mr-1 h-4 w-4" style={{ display: loadingKeyId === h.id + "-refresh" ? "none" : "inline-block" }} />
                                                                Invalidate & Refresh
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="justify-start"
                                                                onClick={() => handle_delete_api_key(h.id)}
                                                                disabled={loadingKeyId === h.id + "-delete"}
                                                            >
                                                                <TrashIcon className="mr-1 h-4 w-4 animate-spin" style={{ display: loadingKeyId === h.id + "-delete" ? "inline-block" : "none" }} />
                                                                <TrashIcon className="mr-1 h-4 w-4" style={{ display: loadingKeyId === h.id + "-delete" ? "none" : "inline-block" }} />
                                                                Delete Token
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>


                        <Separator className="col-span-3" />
                    </div>
                </div >
            ) : (
                <div>
                    <p>No Workflow selected</p>
                </div>
            )
            }
        </div >
    );
}
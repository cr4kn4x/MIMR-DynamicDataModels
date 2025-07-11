import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { viewWorkflowPageContext } from "../../create/PageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import CopyButton from "@/components/my_ui/CopyButton";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";


export default function GeneralTab() {
    const { selected_workflow } = viewWorkflowPageContext();

    const [is_open, set_is_open] = useState(true)

    return (
        <div className="w-full p-4">
            {selected_workflow ? (
                <div>
                    <div className="w-full grid grid-cols-3 gap-5">

                        <Card className="flex flex-col gap-y-1 p-2">
                            <h1 className="font-semibold text-gray-600">Workflow Details</h1>

                            <div className="flex items-center pt-2">
                                {selected_workflow.active ? (
                                    <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">Workflow Active</span>
                                ) : (
                                    <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">Workflow Inactive</span>
                                )}
                            </div>

                            <Label className="font-semibold pt-2">Workflow-Name</Label>
                            <div className="flex items-center pl-1">
                                <Input className="max-h-fit" disabled={true} value={selected_workflow.name}/>
                                <CopyButton value={selected_workflow.name} value_name="workflow name" toaster={toast}/>
                            </div>


                            <Label className="font-semibold pt-2">Workflow-ID</Label>
                            <div className="flex items-center pl-1">
                                <Input className="text-sm" disabled={true} value={selected_workflow.id}/>
                                <CopyButton value={selected_workflow.id} value_name="workflow id" toaster={toast}/>
                            </div>
                        </Card>


                        <Card className="flex flex-col gap-y-1 p-2">
                            <h1 className="font-semibold text-gray-600">Task Details</h1>

                            
                            <Label className="font-semibold pt-2">Input Data Model</Label>
                            <div className="flex items-center pl-1">
                                
                            </div>


                            <Label className="font-semibold pt-2">Output Data Model</Label>
                            <div className="flex items-center pl-1">
                                
                            </div>
                        </Card>





                        
                    </div>

                    <Collapsible open={is_open} onOpenChange={set_is_open}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost">
                                <ChevronsUpDown />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="w-full">
                            <Card>
                                {/* Content for the collapsible card can go here */}
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            ) : (
                <div>
                    <p>No Workflow selected</p>
                </div>
            )}
        </div>
    )


    /*
    return (
      <div className="flex flex-col flex-1 w-full h-full p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div className="text-3xl font-bold flex items-center gap-4">
            {selected_workflow.name}
            {selected_workflow.active ? (
              <Badge className="bg-green-500 text-white">Active</Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
          <div className="text-xs text-gray-400">Workflow ID: {selected_workflow.id}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div>
            <div className="font-semibold text-gray-700 mb-1">Project</div>
            <div className="text-gray-900 mb-4 break-all">{selected_workflow.project_id}</div>
  
            <div className="font-semibold text-gray-700 mb-1">LLM</div>
            <div className="text-gray-900 mb-4 break-all">{selected_workflow.llm}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-1">Input Data Model</div>
            <div className="text-gray-900 mb-4 break-all">{selected_workflow.input_data_model}</div>
  
            <div className="font-semibold text-gray-700 mb-1">Output Data Model</div>
            <div className="text-gray-900 mb-4 break-all">{selected_workflow.output_data_model}</div>
          </div>
        </div>
      </div>
    );
    */
}
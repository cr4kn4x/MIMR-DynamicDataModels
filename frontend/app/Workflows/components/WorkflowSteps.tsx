import { useProject } from "@/app/ProjectContext";
import InputValidationStatus from "@/components/my_ui/InputValidationStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWorkflowNameValidation } from "@/lib/hooks/input-validation/useWorkflowValidation";
import React from "react";
import { useWorkflowPageContext } from "../PageContext";
import { DataModelSelectorCombobox } from "@/components/my_ui/DataModelSelectorCombobox";
import { DataModelCard } from "@/components/my_ui/DataModelCard";
import { toast } from "sonner";
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper";
import { createWorkflow } from "@/lib/api/WorkflowApi";
import { useRouter } from "next/navigation";

// Angepasste Props für Steps
interface GeneralStepProps {
    onNext: () => void
    active: boolean
    setActive: (v: boolean) => void
    name: string
    setName: (v: string) => void
}

interface GeneralSettingsStepProps {
    onNext: () => void
    onBack: () => void
    selected_input_data_model_id: string | null
    set_selected_input_data_model_id: (v: string | null) => void
    selected_output_data_model_id: string | null
    set_selected_output_data_model_id: (v: string | null) => void
}

interface SummaryStepProps {
    onBack: () => void
    active: boolean
    name: string
    selected_input_data_model_id: string | null
    selected_output_data_model_id: string | null
    set_dialog_open: (v: boolean) => void
}

export function GeneralStep({ onNext, active, setActive, name, setName}: GeneralStepProps) {
    const { workflows } = useWorkflowPageContext();
    const { input_valid_status: name_valid_msg, input_valid: name_valid } = useWorkflowNameValidation(name, workflows);
    return (
        <div className="">
            <h2 className="font-bold mb-8">General Settings</h2>
            <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                    <Label className="text-sm font-semibold">Active</Label>
                    <Switch checked={active} onCheckedChange={setActive} />
                </div>
                <div>
                    <Label className="text-sm font-semibold">Workflow Name</Label>
                    <Input value={name} onChange={(e) => { setName(e.target.value) }} placeholder="sentiment_extractor" required />
                    <InputValidationStatus input_valid={name_valid} status={name_valid_msg} />
                </div>
                <div className="flex justify-center">
                    <Button onClick={onNext} className="min-w-fit w-[50%]">Next</Button>
                </div>
            </div>
        </div>
    );
}





export function GeneralSettingsStep({ onBack, onNext, selected_input_data_model_id, set_selected_input_data_model_id, selected_output_data_model_id, set_selected_output_data_model_id }: GeneralSettingsStepProps) {
    const { data_models, native_input_data_models } = useProject();
    const selected_input_data_model = data_models.find((m) => m.id === selected_input_data_model_id) || native_input_data_models.find((m) => m.id === selected_input_data_model_id);
    const selected_output_data_model = data_models.find((m) => m.id === selected_output_data_model_id);
    return (
        <div>
            <h2 className="font-bold mb-8">General Settings</h2>
            <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_min-content_1fr] gap-4">
                    {/* Input Data Model */}
                    <div>
                        <Label className="text-sm font-semibold mb-1 block">Input Data Structure</Label>
                        <DataModelSelectorCombobox data_models={data_models.concat(native_input_data_models)} selected_data_model_id={selected_input_data_model_id} set_selected_data_model_id={set_selected_input_data_model_id} className="min-w-fit" />
                        <div className="mt-2">
                            {selected_input_data_model ? (
                                <DataModelCard is_selected={true} data_model={selected_input_data_model} preview={true} refresh_data_models={() => { toast.error("Unexpected call of refresh_data_models trigger") }} />
                            ) : (
                                <div className="text-gray-400 text-sm italic">Not selected</div>
                            )}
                        </div>
                    </div>
                    {/* Transformation Block */}
                    <div className="flex flex-col items-center justify-center relative px-0 min-w-[60px]">
                        <svg width="48" height="16" viewBox="0 0 48 16" className="mx-0">
                            <defs>
                                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                    <polygon points="0,0 6,3 0,6" fill="#6366f1" />
                                </marker>
                            </defs>
                            <line x1="4" y1="8" x2="44" y2="8" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrow)" />
                        </svg>
                        <div className="text-xs text-indigo-500 mt-1 whitespace-nowrap">✨AI Transformation✨</div>
                    </div>
                    {/* Output Data Model */}
                    <div>
                        <Label className="text-sm font-semibold mb-1 block">Output Data Structure</Label>
                        <DataModelSelectorCombobox data_models={data_models} selected_data_model_id={selected_output_data_model_id} set_selected_data_model_id={set_selected_output_data_model_id} className="min-w-fit" />
                        <div className="mt-2">
                            {selected_output_data_model ? (
                                <DataModelCard is_selected={true} data_model={selected_output_data_model} preview={true} refresh_data_models={() => { toast.error("Unexpected call of refresh_data_models trigger") }} />
                            ) : (
                                <div className="text-gray-400 text-sm italic">Not selected</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-2">
                    <Button onClick={onBack} className="min-w-fit w-[45%]">Back</Button>
                    <Button onClick={onNext} className="min-w-fit w-[45%]">Next</Button>
                </div>
            </div>
        </div>
    );
}


export function SummaryStep({ onBack, active, name, selected_input_data_model_id, selected_output_data_model_id, set_dialog_open}: SummaryStepProps) {
    
    const { llms, data_models, native_input_data_models, selected_project_id} = useProject()
    const input_model = data_models.concat(native_input_data_models).find((m) => m.id === selected_input_data_model_id)
    const output_model = data_models.find((m) => m.id === selected_output_data_model_id)
    
    
    const router = useRouter()
    

    async function handle_create_workflow() {
        if(selected_project_id == null || input_model == null || output_model == null || name == null || name.length == 0){toast.error("Invalid Inputs", {richColors: true}); return;}

        const res = await apiCallWrapper(createWorkflow(selected_project_id, input_model.id, output_model.id, active, name), toast, "Failed to create Workflow")
        
        if(res){
            toast.success("Workflow created...", {richColors: true})
            set_dialog_open(false)
            router.push(`/Workflows/view?project_id=${selected_project_id}&workflow_id=${res.id}`)
        }
    }


    return (
        <div>
            <h2 className="font-bold mb-8">Confirm Creation</h2>
            
            <div className="grid grid-cols-4 gap-1">
                <Label>Name</Label>
                <Input className="col-span-3" value={name} disabled={true}/>

                <Label>Active</Label>
                <Input className="col-span-3" value={active ? "Yes": "No"} disabled={true} />

                <Label>Input Data Model</Label>
                <Input className="col-span-3" value={input_model?.name} disabled={true}></Input>

                <Label>Output Data Model</Label>
                <Input className="col-span-3" value={output_model?.name} disabled={true}></Input>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                <Button onClick={onBack} className="min-w-fit w-[45%]">Back</Button>
                <Button onClick={()=>{handle_create_workflow()}} className="min-w-fit w-[45%]">Create Workflow</Button>
            </div>
        </div>
    )
}
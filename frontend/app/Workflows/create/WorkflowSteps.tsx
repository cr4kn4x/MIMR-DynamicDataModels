import { useProject } from "@/app/ProjectContext";
import InputValidationStatus from "@/components/my_ui/InputValidationStatus";
import LLMSelctor from "@/components/my_ui/LLMSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useWorkflowNameValidation, useWorkflowValidation } from "@/lib/hooks/input-validation/useWorkflowValidation";
import React, { useState } from "react";
import { useWorkflowPageContext } from "../PageContext";

interface StepProps {
    onNext: () => void;
    onBack: () => void;
}

export function GeneralStep({ onNext }: StepProps) {

    const [active, set_active] = useState<boolean>(true)
    const [name, set_name] = useState<string>("")
    const [selected_llm_id, set_selected_llm_id] = useState<string>("")

    const {llms} = useProject()
    const {workflows} = useWorkflowPageContext()
    
    const {input_valid_status: name_valid_msg, input_valid: name_valid} = useWorkflowNameValidation(name, workflows)


    return (
        <div className="">
            <h2 className="font-bold mb-8">General Settings</h2>

            <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                    <Label className="text-sm font-semibold">Active</Label>
                    <Switch checked={active} onCheckedChange={(c) => { set_active(c) }} />
                </div>

                <div>
                    <Label className="text-sm font-semibold">Workflow Name</Label>
                    <Input value={name} onChange={(e) => { set_name(e.target.value) }} placeholder="sentiment_extractor" required />
                    <InputValidationStatus input_valid={name_valid} status={name_valid_msg}/>
                </div>

                <div>
                    <Label className="text-sm font-semibold">Artifical Intelligence</Label>
                    <LLMSelctor llms={llms} set_selected_llm_id={set_selected_llm_id} selected_llm_id={selected_llm_id} /> 
                </div>
                
                <div className="flex justify-center">
                    <Button onClick={onNext} className="min-w-fit w-[50%]">Next</Button>
                </div>
            </div>
        </div>
    )
}





export const ConfigurationStep: React.FC<StepProps> = ({ onNext, onBack }) => (
    <div className="">
            <h2 className="font-bold mb-8">General Settings</h2>

            <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                    
                </div>

                <div>
                   
                </div>

                <div>
                   
                </div>
                
                <div className="flex justify-center gap-2">
                    <Button onClick={onBack} className="min-w-fit w-[45%]">Back</Button>
                    <Button onClick={onNext} className="min-w-fit w-[45%]">Next</Button>
                </div>
            </div>
        </div>
)

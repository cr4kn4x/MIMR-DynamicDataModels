import React, { useState } from "react";
import { GeneralStep, GeneralSettingsStep, SummaryStep } from "./WorkflowSteps";



interface WorkflowCreateStepperProps {
    set_dialog_open: (v: boolean) => void
}

export default function WorkflowCreateStepper({set_dialog_open}: WorkflowCreateStepperProps) {
   
    const [step, setStep] = useState(0);
    const [active, setActive] = useState(true);
    const [name, setName] = useState("");
    const [selected_llm_id, setSelectedLlmId] = useState("");
    const [selected_input_data_model_id, setSelectedInputDataModelId] = useState<string | null>(null);
    const [selected_output_data_model_id, setSelectedOutputDataModelId] = useState<string | null>(null);

    const next = () => setStep((s) => Math.min(s + 1, 2));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    return (
        <div>
            {step === 0 && (
                <GeneralStep
                    onNext={next}
                    active={active}
                    setActive={setActive}
                    name={name}
                    setName={setName}
                    selected_llm_id={selected_llm_id}
                    setSelectedLlmId={setSelectedLlmId}
                />
            )}
            {step === 1 && (
                <GeneralSettingsStep
                    onBack={back}
                    onNext={next}
                    selected_input_data_model_id={selected_input_data_model_id}
                    set_selected_input_data_model_id={setSelectedInputDataModelId}
                    selected_output_data_model_id={selected_output_data_model_id}
                    set_selected_output_data_model_id={setSelectedOutputDataModelId}
                />
            )}
            {step === 2 && (
                <SummaryStep
                    onBack={back}
                    active={active}
                    name={name}
                    selected_llm_id={selected_llm_id}
                    selected_input_data_model_id={selected_input_data_model_id}
                    selected_output_data_model_id={selected_output_data_model_id}
                    set_dialog_open={set_dialog_open}
                />
            )}
        </div>
    );
}

"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react";
import { ConfigurationStep, GeneralStep } from "../create/WorkflowSteps";



interface CreateWorkflowWizardProps {
    open: boolean;
    onOpenChange: (val: boolean) => void;
}












export default function CreateWorkflowWizard({open, onOpenChange}: CreateWorkflowWizardProps) {
    
    const [step, setStep] = useState(0)
    const nextStep = () => setStep((s) => Math.min(s + 1, 3))
    const prevStep = () => setStep((s) => Math.max(s - 1, 0))
    const handleOpenChange = (val: boolean) => {
        onOpenChange(val);
        if (!val) setStep(0)
    }


    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-none max-h-none h-[95%] w-[95%] sm:max-w-none">
                <div>
                    {step === 0 && <GeneralStep onNext={nextStep} onBack={() => { }} />}
                    {step === 1 && <ConfigurationStep onNext={nextStep} onBack={prevStep} />}
                    <div className="mt-4 text-center  text-sm text-gray-500">Step {step + 1} of 2</div>                
                </div>
            </DialogContent>
        </Dialog>
    )
}
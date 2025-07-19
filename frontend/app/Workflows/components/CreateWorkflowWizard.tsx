"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react";
import { GeneralSettingsStep, GeneralStep } from "../create/WorkflowSteps";
import WorkflowCreateStepper from "../create/WorkflowCreateStepper";



interface CreateWorkflowWizardProps {
    open: boolean;
    set_open: (val: boolean) => void;
}


export default function CreateWorkflowWizard({open, set_open}: CreateWorkflowWizardProps) {
    

    return (
        <Dialog open={open} onOpenChange={set_open}>
            <DialogContent className="max-w-none max-h-none h-[95%] w-[95%] sm:max-w-none">
                <div>
                    <WorkflowCreateStepper set_dialog_open={set_open} />        
                </div>
            </DialogContent>
        </Dialog>
    )
}
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { redirect_based_on_login } from "@/lib/redirect"
import { useRouter } from "next/navigation"
import {
  GeneralStep,
  ConfigurationStep,
  SecurityStep,
  SummaryStep
} from "./WorkflowSteps"


  const router = useRouter();
  useEffect(() => {
    redirect_based_on_login(router);
  }, [router]);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) setStep(0);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex flex-col justify-center items-center">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <button className="btn mt-8">Workflow erstellen</button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <Card className="w-full h-auto rounded-lg shadow-none">
              <CardContent>
                {step === 0 && <GeneralStep onNext={nextStep} onBack={() => {}} />}
                {step === 1 && <ConfigurationStep onNext={nextStep} onBack={prevStep} />}
                {step === 2 && <SecurityStep onNext={nextStep} onBack={prevStep} />}
                {step === 3 && <SummaryStep onBack={prevStep} onNext={() => setOpen(false)} />}
                <div className="mt-4 text-center text-gray-500">Schritt {step + 1} von 4</div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );

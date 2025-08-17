import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WizardStepsProps {
  currentStep: number
  steps: string[]
  onStepChange: (step: number) => void
}













export function WizardSteps({ currentStep, steps, onStepChange }: WizardStepsProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors",
                currentStep === index 
                  ? "bg-blue-500 text-white" 
                  : currentStep > index 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-500"
              )}
              onClick={() => onStepChange(index)}
            >
              {currentStep > index ? (
                <span>✓</span>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="mt-2 text-xs text-center w-24 truncate">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

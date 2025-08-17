import { useState, useEffect } from "react"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"

export interface DataRecord {
  id: string
  inputData: Record<string, any>
  annotationData: Record<string, any>
  createdAt: string
}

export const useDataStudio = () => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0)
  
  // Data model selection
  const [selectedInputDataModel, setSelectedInputDataModel] = useState<DataModel | null>(null)
  const [selectedOutputDataModel, setSelectedOutputDataModel] = useState<DataModel | null>(null)
  
  // Form data
  const [inputFormData, setInputFormData] = useState<Record<string, any>>({})
  const [annotationFormData, setAnnotationFormData] = useState<Record<string, any>>({})
  
  // Form validation
  const [isInputFormValid, setIsInputFormValid] = useState(false)
  const [isAnnotationFormValid, setIsAnnotationFormValid] = useState(false)
  
  // LLM annotation
  const [llmAnnotation, setLlmAnnotation] = useState<Record<string, any> | null>(null)
  const [useLlm, setUseLlm] = useState(false)
  
  // Dataset records
  const [records, setRecords] = useState<DataRecord[]>([])
  
  // Reset form data when data models change
  useEffect(() => {
    setInputFormData({})
    setAnnotationFormData({})
    setLlmAnnotation(null)
    setUseLlm(false)
  }, [selectedInputDataModel, selectedOutputDataModel])
  
  // Wizard steps
  const steps = [
    "Project & Data Models",
    "Input Data",
    "Annotation Method",
    "Annotation",
    "Review & Save"
  ]
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
    }
  }
  
  // Save record
  const saveRecord = () => {
    const newRecord: DataRecord = {
      id: Math.random().toString(36).substring(2, 9),
      inputData: { ...inputFormData },
      annotationData: { ...annotationFormData },
      createdAt: new Date().toISOString()
    }
    
    setRecords(prev => [...prev, newRecord])
    
    // Reset form data
    setInputFormData({})
    setAnnotationFormData({})
    setLlmAnnotation(null)
    setUseLlm(false)
    
    // Go back to dataset view
    setCurrentStep(0)
  }
  
  // Reset wizard
  const resetWizard = () => {
    setCurrentStep(0)
    setInputFormData({})
    setAnnotationFormData({})
    setLlmAnnotation(null)
    setUseLlm(false)
  }
  
  return {
    // Wizard state
    currentStep,
    steps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    
    // Data model selection
    selectedInputDataModel,
    setSelectedInputDataModel,
    selectedOutputDataModel,
    setSelectedOutputDataModel,
    
    // Form data
    inputFormData,
    setInputFormData,
    annotationFormData,
    setAnnotationFormData,
    
    // Form validation
    isInputFormValid,
    setIsInputFormValid,
    isAnnotationFormValid,
    setIsAnnotationFormValid,
    
    // LLM annotation
    llmAnnotation,
    setLlmAnnotation,
    useLlm,
    setUseLlm,
    
    // Dataset records
    records,
    saveRecord,
    resetWizard
  }
}

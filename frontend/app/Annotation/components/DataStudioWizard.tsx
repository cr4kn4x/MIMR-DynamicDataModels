import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WizardSteps } from "./WizardSteps"
import { DataEntryForm } from "./DataEntryForm"
import { AnnotationForm } from "./AnnotationForm"
import { DatasetViewer } from "./DatasetViewer"
import { useDataStudio } from "../hooks/useDataStudio"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { ProjectSelectorCombobox } from "@/components/my_ui/ProjectSelectorCombobox"
import { DataModelSelectorCombobox } from "@/components/my_ui/DataModelSelectorCombobox"
import { useProject } from "@/app/ProjectContext"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bot, Database, FileText, PenTool, Save } from "lucide-react"

interface DataStudioWizardProps {
  input_data_model_id: string | null
  set_input_data_model_id: (id: string | null) => void
  output_data_model: string | null
  set_output_data_model: (id: string | null) => void
}

export function DataStudioWizard({
  input_data_model_id: selectedInputDataModelId,
  set_input_data_model_id: setSelectedInputDataModelId,
  output_data_model: selectedOutputDataModelId,
  set_output_data_model: setSelectedOutputDataModelId
}: DataStudioWizardProps) {
  const {
    currentStep,
    steps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    selectedInputDataModel,
    setSelectedInputDataModel,
    selectedOutputDataModel,
    setSelectedOutputDataModel,
    inputFormData,
    setInputFormData,
    annotationFormData,
    setAnnotationFormData,
    isInputFormValid,
    setIsInputFormValid,
    isAnnotationFormValid,
    setIsAnnotationFormValid,
    llmAnnotation,
    setLlmAnnotation,
    useLlm,
    setUseLlm,
    records,
    saveRecord,
    resetWizard
  } = useDataStudio()

  const { projects, refresh_projects, selected_project_id, set_selected_project_id, data_models } = useProject()

  // Set selected data models when IDs change
  React.useEffect(() => {
    if (selectedInputDataModelId) {
      const dm = data_models.find(dm => dm.id === selectedInputDataModelId)
      if (dm) setSelectedInputDataModel(dm)
    }
  }, [selectedInputDataModelId])

  React.useEffect(() => {
    if (selectedOutputDataModelId) {
      const dm = data_models.find(dm => dm.id === selectedOutputDataModelId)
      if (dm) setSelectedOutputDataModel(dm)
    }
  }, [selectedOutputDataModelId])

  // Update parent state when local state changes
  React.useEffect(() => {
    if (selectedInputDataModel) {
      setSelectedInputDataModelId(selectedInputDataModel.id)
    } else {
      setSelectedInputDataModelId(null)
    }
  }, [selectedInputDataModel])

  React.useEffect(() => {
    if (selectedOutputDataModel) {
      setSelectedOutputDataModelId(selectedOutputDataModel.id)
    } else {
      setSelectedOutputDataModelId(null)
    }
  }, [selectedOutputDataModel])

  // Handle step navigation
  const handleNext = () => {
    // Validate forms before proceeding
    if (currentStep === 1 && !isInputFormValid) return
    if (currentStep === 3 && !isAnnotationFormValid) return
    
    goToNextStep()
  }



  const InitializationStep = () => {

    return(
      <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Input Data Model
                </h3>
                <DataModelSelectorCombobox
                  data_models={data_models}
                  selected_data_model_id={selectedInputDataModelId}
                  set_selected_data_model_id={setSelectedInputDataModelId}
                />
                {selectedInputDataModel && (
                  <div className="mt-2 text-xs text-gray-500">
                    Selected: {selectedInputDataModel.name}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <PenTool className="w-4 h-4 mr-2" />
                  Annotation Data Model
                </h3>
                <DataModelSelectorCombobox
                  data_models={data_models}
                  selected_data_model_id={selectedOutputDataModelId}
                  set_selected_data_model_id={setSelectedOutputDataModelId}
                />
                {selectedOutputDataModel && (
                  <div className="mt-2 text-xs text-gray-500">
                    Selected: {selectedOutputDataModel.name}
                  </div>
                )}
              </div>
            </div>
            
            {selectedInputDataModel && selectedOutputDataModel && (
              <Alert>
                <AlertTitle>Data Models Selected</AlertTitle>
                <AlertDescription>
                  You've selected "{selectedInputDataModel.name}" for input data and "{selectedOutputDataModel.name}" for annotations.
                  Click "Next" to start entering data.
                </AlertDescription>
              </Alert>
            )}
          </div>
    )
  }






  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <InitializationStep/>
        )
      
      case 1: // Input Data Entry
        return selectedInputDataModel ? (
          <DataEntryForm
            dataModel={selectedInputDataModel}
            formData={inputFormData}
            setFormData={setInputFormData}
            setFormValid={setIsInputFormValid}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select an input data model in the previous step.
          </div>
        )
      
      case 2: // Annotation Method Selection
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">How would you like to create your annotation?</h3>
              <p className="text-gray-500">Choose between manual entry or AI assistance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all ${!useLlm ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                onClick={() => setUseLlm(false)}
              >
                <CardHeader>
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <CardTitle className="text-center">Manual Annotation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">
                    Manually enter all annotation data yourself
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${useLlm ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                onClick={() => setUseLlm(true)}
              >
                <CardHeader>
                  <Bot className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <CardTitle className="text-center">LLM Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">
                    Use AI to help generate annotations, then review and edit
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {selectedOutputDataModel && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Annotation Data Model: {selectedOutputDataModel.name}</h4>
                <p className="text-sm text-gray-600">
                  You'll be annotating with the "{selectedOutputDataModel.name}" schema which contains {selectedOutputDataModel.fields.length} fields.
                </p>
              </div>
            )}
          </div>
        )
      
      case 3: // Annotation Entry
        return selectedOutputDataModel ? (
          <AnnotationForm
            dataModel={selectedOutputDataModel}
            formData={annotationFormData}
            setFormData={setAnnotationFormData}
            setFormValid={setIsAnnotationFormValid}
            llmAnnotation={llmAnnotation}
            setLlmAnnotation={setLlmAnnotation}
            useLlm={useLlm}
            setUseLlm={setUseLlm}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select an annotation data model in the first step.
          </div>
        )
      
      case 4: // Review & Save
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Input Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedInputDataModel && Object.keys(inputFormData).length > 0 ? (
                    <div className="space-y-2">
                      {selectedInputDataModel.fields.map(field => (
                        <div key={field.id} className="flex justify-between border-b pb-2">
                          <span className="font-medium">{field.name}:</span>
                          <span className="text-gray-600">{String(inputFormData[field.name] ?? "—")}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No input data entered</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="w-5 h-5 mr-2" />
                    Annotation Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOutputDataModel && Object.keys(annotationFormData).length > 0 ? (
                    <div className="space-y-2">
                      {selectedOutputDataModel.fields.map(field => (
                        <div key={field.id} className="flex justify-between border-b pb-2">
                          <span className="font-medium">{field.name}:</span>
                          <span className="text-gray-600">{String(annotationFormData[field.name] ?? "—")}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No annotation data entered</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Alert>
              <AlertTitle>Ready to Save</AlertTitle>
              <AlertDescription>
                Review your data above. If everything looks correct, click "Save Record" to add it to your dataset.
              </AlertDescription>
            </Alert>
          </div>
        )
      
      default:
        return null
    }
  }

  // Determine if next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 0) {
      return !selectedInputDataModelId || !selectedOutputDataModelId
    }
    if (currentStep === 1) {
      return !isInputFormValid
    }
    if (currentStep === 3) {
      return !isAnnotationFormValid
    }
    return false
  }

  return (
    <div className="space-y-6">
      {/* Dataset Viewer when on step 0 */}
      {currentStep === 0 && selectedInputDataModel && (
        <DatasetViewer 
          dataModel={selectedInputDataModel} 
          records={records} 
          onAddRecord={() => {}} // Handled by the wizard navigation
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Data Studio Wizard</span>
            <span className="text-sm font-normal text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <WizardSteps 
            currentStep={currentStep} 
            steps={steps} 
            onStepChange={goToStep} 
          />
          
          <div className="mt-6">
            {renderStepContent()}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPreviousStep} 
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              disabled={isNextDisabled()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={saveRecord} 
              disabled={isNextDisabled()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Record
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

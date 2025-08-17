import React, { useState, useEffect } from "react"
import { DataModel, DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InputValidated from "@/components/my_ui/InputValidated"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Bot, User } from "lucide-react"

interface AnnotationFormProps {
  dataModel: DataModel
  formData: Record<string, any>
  setFormData: (data: Record<string, any>) => void
  setFormValid: (valid: boolean) => void
  llmAnnotation: Record<string, any> | null
  setLlmAnnotation: (data: Record<string, any> | null) => void
  useLlm: boolean
  setUseLlm: (use: boolean) => void
}

export function AnnotationForm({ 
  dataModel, 
  formData, 
  setFormData, 
  setFormValid,
  llmAnnotation,
  setLlmAnnotation,
  useLlm,
  setUseLlm
}: AnnotationFormProps) {
  // Validation states for each field
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({})
  
  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {}
    dataModel.fields.forEach(field => {
      if (formData[field.name] === undefined) {
        // Set default values based on field type
        switch (field.type) {
          case "int":
          case "float":
            initialData[field.name] = ""
            break
          case "bool":
            initialData[field.name] = false
            break
          default:
            initialData[field.name] = ""
        }
      }
    })
    
    // Merge with existing formData
    setFormData({ ...initialData, ...formData })
  }, [dataModel])
  
  // Check overall form validation
  useEffect(() => {
    const allValid = Object.values(fieldValidations).every(valid => valid)
    const hasAllFields = dataModel.fields.every(field => fieldValidations[field.name] !== undefined)
    setFormValid(hasAllFields && allValid)
  }, [fieldValidations, dataModel])
  
  // Handle input changes
  const handleInputChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value })
  }
  
  // Simulate LLM annotation
  const generateLlmAnnotation = () => {
    const simulatedAnnotation: Record<string, any> = {}
    dataModel.fields.forEach(field => {
      switch (field.type) {
        case "str":
          simulatedAnnotation[field.name] = `Simulated ${field.name} annotation`
          break
        case "int":
          simulatedAnnotation[field.name] = Math.floor(Math.random() * 100)
          break
        case "float":
          simulatedAnnotation[field.name] = Math.random() * 100
          break
        case "bool":
          simulatedAnnotation[field.name] = Math.random() > 0.5
          break
        default:
          simulatedAnnotation[field.name] = `Simulated value for ${field.name}`
      }
    })
    setLlmAnnotation(simulatedAnnotation)
    setUseLlm(true)
  }
  
  // Apply LLM annotation to form
  const applyLlmAnnotation = () => {
    if (llmAnnotation) {
      setFormData({ ...llmAnnotation })
    }
  }
  
  // Render appropriate input component based on field type
  const renderFieldInput = (field: DataModelField) => {
    // If using LLM and we have LLM data for this field, show it as a suggestion
    const isLlmSuggestion = useLlm && llmAnnotation && llmAnnotation[field.name] !== undefined
    
    const commonProps = {
      key: field.id,
      value: formData[field.name] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(field.name, e.target.value),
      placeholder: field.description || field.name,
    }
    
    switch (field.type) {
      case "str":
        return (
          <div className="relative">
            <InputValidated
              {...commonProps}
              zod={z.string().min(1, "This field is required")}
              set_input_valid={(valid) => setFieldValidations(prev => ({ ...prev, [field.name]: valid }))}
            />
            {isLlmSuggestion && (
              <div className="mt-1 text-sm text-blue-600 flex items-center">
                <Bot className="w-3 h-3 mr-1" />
                Suggestion: {llmAnnotation[field.name]}
              </div>
            )}
          </div>
        )
        
      case "int":
        return (
          <div className="relative">
            <InputValidated
              {...commonProps}
              type="number"
              zod={z.number().int().or(z.string().min(1, "This field is required"))}
              set_input_valid={(valid) => setFieldValidations(prev => ({ ...prev, [field.name]: valid }))}
              value={formData[field.name] === "" ? "" : Number(formData[field.name])}
              onChange={(e) => handleInputChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
            />
            {isLlmSuggestion && (
              <div className="mt-1 text-sm text-blue-600 flex items-center">
                <Bot className="w-3 h-3 mr-1" />
                Suggestion: {llmAnnotation[field.name]}
              </div>
            )}
          </div>
        )
        
      case "float":
        return (
          <div className="relative">
            <InputValidated
              {...commonProps}
              type="number"
              step="0.01"
              zod={z.number().or(z.string().min(1, "This field is required"))}
              set_input_valid={(valid) => setFieldValidations(prev => ({ ...prev, [field.name]: valid }))}
              value={formData[field.name] === "" ? "" : Number(formData[field.name])}
              onChange={(e) => handleInputChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
            />
            {isLlmSuggestion && (
              <div className="mt-1 text-sm text-blue-600 flex items-center">
                <Bot className="w-3 h-3 mr-1" />
                Suggestion: {llmAnnotation[field.name]}
              </div>
            )}
          </div>
        )
        
      case "bool":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={formData[field.name] || false}
                onCheckedChange={(checked) => handleInputChange(field.name, checked)}
              />
              <Label htmlFor={field.name}>{field.description || field.name}</Label>
            </div>
            {isLlmSuggestion && (
              <div className="text-sm text-blue-600 flex items-center">
                <Bot className="w-3 h-3 mr-1" />
                Suggestion: {llmAnnotation[field.name] ? "Yes" : "No"}
              </div>
            )}
          </div>
        )
        
      case "datetime":
        return (
          <div className="relative">
            <Input
              {...commonProps}
              type="datetime-local"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
            {isLlmSuggestion && (
              <div className="mt-1 text-sm text-blue-600 flex items-center">
                <Bot className="w-3 h-3 mr-1" />
                Suggestion: {llmAnnotation[field.name]}
              </div>
            )}
          </div>
        )
        
      case "date":
        return (
          <div className="relative">
            <Input
              {...commonProps}
              type="date"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
            {isLlmSuggestion && (
              <div className="mt-1 text-sm text-blue-600 flex items-center">
                <Bot className="w-3 h-3 mr-1" />
                Suggestion: {llmAnnotation[field.name]}
              </div>
            )}
          </div>
        )
        
      default:
        if (field.type.startsWith("List[")) {
          return (
            <div className="relative">
              <Textarea
                {...commonProps}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value.split(","))}
                placeholder="Enter comma-separated values"
              />
              {isLlmSuggestion && (
                <div className="mt-1 text-sm text-blue-600 flex items-center">
                  <Bot className="w-3 h-3 mr-1" />
                  Suggestion: {llmAnnotation[field.name]}
                </div>
              )}
            </div>
          )
        } else if (field.type.startsWith("Optional[")) {
          return (
            <div className="relative">
              <Input
                {...commonProps}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
              {isLlmSuggestion && (
                <div className="mt-1 text-sm text-blue-600 flex items-center">
                  <Bot className="w-3 h-3 mr-1" />
                  Suggestion: {llmAnnotation[field.name]}
                </div>
              )}
            </div>
          )
        }
        return (
          <div className="relative">
            <Input
              {...commonProps}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
            {isLlmSuggestion && (
              <div className="mt-1 text-sm text-blue-600 flex items-center">
                <Bot className="w-3 h-3 mr-1" />
                Suggestion: {llmAnnotation[field.name]}
              </div>
            )}
          </div>
        )
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-2">
        <h3 className="text-lg font-medium">{dataModel.name}</h3>
        <p className="text-sm text-gray-500">Enter the annotation data according to the schema</p>
      </div>
      
      {/* LLM Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <span className="font-medium">LLM Annotation Assistant</span>
          <span className="text-sm text-gray-500">Let AI help with your annotations</span>
        </div>
        <div className="flex items-center space-x-4">
          {llmAnnotation && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={applyLlmAnnotation}
              disabled={!useLlm}
            >
              <User className="w-4 h-4 mr-2" />
              Apply Suggestions
            </Button>
          )}
          <Button 
            variant={useLlm ? "default" : "outline"} 
            size="sm" 
            onClick={generateLlmAnnotation}
          >
            {useLlm ? "Regenerate" : "Generate"} with LLM
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataModel.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center">
              {field.name}
              {!field.type.startsWith("Optional") && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderFieldInput(field)}
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

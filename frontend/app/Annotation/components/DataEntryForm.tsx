import React, { useState, useEffect } from "react"
import { DataModel, DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InputValidated from "@/components/my_ui/InputValidated"
import { z } from "zod"

interface DataEntryFormProps {
  dataModel: DataModel
  formData: Record<string, any>
  setFormData: (data: Record<string, any>) => void
  setFormValid: (valid: boolean) => void
}

export function DataEntryForm({ dataModel, formData, setFormData, setFormValid }: DataEntryFormProps) {
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
  
  // Render appropriate input component based on field type
  const renderFieldInput = (field: DataModelField) => {
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
          <InputValidated
            {...commonProps}
            zod={z.string().min(1, "This field is required")}
            set_input_valid={(valid) => setFieldValidations(prev => ({ ...prev, [field.name]: valid }))}
          />
        )
        
      case "int":
        return (
          <InputValidated
            {...commonProps}
            type="number"
            zod={z.number().int().or(z.string().min(1, "This field is required"))}
            set_input_valid={(valid) => setFieldValidations(prev => ({ ...prev, [field.name]: valid }))}
            value={formData[field.name] === "" ? "" : Number(formData[field.name])}
            onChange={(e) => handleInputChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
          />
        )
        
      case "float":
        return (
          <InputValidated
            {...commonProps}
            type="number"
            step="0.01"
            zod={z.number().or(z.string().min(1, "This field is required"))}
            set_input_valid={(valid) => setFieldValidations(prev => ({ ...prev, [field.name]: valid }))}
            value={formData[field.name] === "" ? "" : Number(formData[field.name])}
            onChange={(e) => handleInputChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
          />
        )
        
      case "bool":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleInputChange(field.name, checked)}
            />
            <Label htmlFor={field.name}>{field.description || field.name}</Label>
          </div>
        )
        
      case "datetime":
        return (
          <Input
            {...commonProps}
            type="datetime-local"
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        )
        
      case "date":
        return (
          <Input
            {...commonProps}
            type="date"
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        )
        
      default:
        if (field.type.startsWith("List[")) {
          return (
            <Textarea
              {...commonProps}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value.split(","))}
              placeholder="Enter comma-separated values"
            />
          )
        } else if (field.type.startsWith("Optional[")) {
          return (
            <Input
              {...commonProps}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          )
        }
        return (
          <Input
            {...commonProps}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        )
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-2">
        <h3 className="text-lg font-medium">{dataModel.name}</h3>
        <p className="text-sm text-gray-500">Enter the input data according to the schema</p>
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

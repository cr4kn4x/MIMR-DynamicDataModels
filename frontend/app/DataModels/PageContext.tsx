"use client"
import { getAllProjects, getDataModelsByProjectId } from "@/lib/api/DataModelApi"
import { DataModel, Project, DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"




export interface DataModelsContextType {
    selected_project_id: string | null
    set_selected_project_id(id: string|null): void 

    selected_project: Project | null 

    projects: Project[]
    set_projects(lst: Project[]): void

    project_data_models: DataModel[]
    set_project_data_models (v: DataModel[]): void 

    selected_data_model: DataModel | null 
    set_selected_data_model(v: DataModel | null): void

    // Field operations
    addFieldToModel: (modelId: string, field: Omit<DataModelField, 'id'>) => void
    deleteFieldFromModel: (modelId: string, fieldId: string) => void
}


export const DataModelsPageContext = createContext<DataModelsContextType | undefined>(undefined)


export function useDataModelsPageContext() {
    const ctx = useContext(DataModelsPageContext)
    if (!ctx) throw new Error("useDataModelsPageContext must be used within DataModelsPageContextProvider")
    return ctx
}


export function DataModelsPageContextProvider({ children }: { children: ReactNode }) {
    const [selected_data_model, set_selected_data_model] = useState<DataModel | null>(null)
    const [selected_project_id, set_selected_project_id] = useState<string | null>(null)
    const [selected_project, set_selected_project] = useState<Project | null>(null)
    const [projects, set_projects] = useState<Project[]>([])
    const [project_data_models, set_project_data_models] = useState<DataModel[]>([])



    // initial fetch
    useEffect(()=>{
        getAllProjects()
            .then((res) => {set_projects(res.projects)})
            .catch((error) => {console.error(error.message)}) // can be shown in toast for example ... 
    }, [])

    
    useEffect(() => {
        if(selected_project_id == null){
            set_project_data_models([])
            return
        }

        getDataModelsByProjectId(selected_project_id)
            .then((res) => {set_project_data_models(res.data_models)})
            .catch((error) => {console.error(error.message)}) // maybe toast
        

        const selected_project = projects.find((project) => project.id == selected_project_id)
        if(selected_project == null){
            console.error(`Selected project (id: ${selected_project_id}) is not available in client projects`)
            return
        }
        set_selected_project(selected_project)
        
            

    }, [selected_project_id])
    
    // Add field to a specific model (local state update for now)
    const addFieldToModel = (modelId: string, field: Omit<DataModelField, 'id'>) => {
        // Generate a temporary ID for the field
        const newField: DataModelField = {
            ...field,
            id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
        
        // Update project_data_models
        set_project_data_models(prevModels => 
            prevModels.map(model => 
                model.id === modelId 
                    ? { ...model, fields: [...model.fields, newField] }
                    : model
            )
        )
        
        // Update selected_data_model if it's the same model
        if (selected_data_model?.id === modelId) {
            set_selected_data_model(prevModel => 
                prevModel ? { ...prevModel, fields: [...prevModel.fields, newField] } : null
            )
        }
        
        // TODO: Hier würde normalerweise ein API Call stehen
        // await addFieldToDataModel(modelId, field)
    }

    // Delete field from a specific model (local state update for now)
    const deleteFieldFromModel = (modelId: string, fieldId: string) => {
        // Update project_data_models
        set_project_data_models(prevModels => 
            prevModels.map(model => 
                model.id === modelId 
                    ? { ...model, fields: model.fields.filter(field => field.id !== fieldId) }
                    : model
            )
        )
        
        // Update selected_data_model if it's the same model
        if (selected_data_model?.id === modelId) {
            set_selected_data_model(prevModel => 
                prevModel ? { 
                    ...prevModel, 
                    fields: prevModel.fields.filter(field => field.id !== fieldId) 
                } : null
            )
        }
        
        // TODO: Hier würde normalerweise ein API Call stehen
        // await deleteFieldFromDataModel(modelId, fieldId)
    }
    
    const value: DataModelsContextType = {
        selected_project_id,
        set_selected_project_id,
        
        selected_project,

        projects, 
        set_projects,

        project_data_models,
        set_project_data_models,

        selected_data_model,
        set_selected_data_model,

        addFieldToModel,
        deleteFieldFromModel
    }
    
    return React.createElement(DataModelsPageContext.Provider, { value: value }, children)
}

"use client"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import React, { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import { useProject } from "../ProjectContext"

export interface DataModelsContextType {
    selected_data_model_id: string | null 
    set_selected_data_model_id(id: string | null): void
    selected_data_model: DataModel | null
}


export const DataModelsPageContext = createContext<DataModelsContextType | undefined>(undefined)


export function useDataModelsPageContext() {
    const ctx = useContext(DataModelsPageContext)
    if (!ctx) throw new Error("useDataModelsPageContext must be used within DataModelsPageContextProvider")
    return ctx
}


export function DataModelsPageContextProvider({ children }: { children: ReactNode }) {
    // 
    const {data_models, selected_project_id, projects} = useProject()

    
    const [selected_data_model_id, set_selected_data_model_id] = useState<string | null>(null)

    const selected_data_model = useMemo(() => {
        if (!selected_data_model_id) return null;
        const found = data_models.find(dm => dm.id === selected_data_model_id);
        return found || null;
    }, [selected_data_model_id, data_models])
    
    



    const value: DataModelsContextType = {
        selected_data_model_id,
        set_selected_data_model_id,
        selected_data_model,        
    }
    
    return React.createElement(DataModelsPageContext.Provider, { value: value }, children)
}

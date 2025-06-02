"use client"
import React, { createContext, useContext, useState, type ReactNode } from "react"




export interface DataModelsContextType {

}


export const DataModelsContext = createContext<DataModelsContextType | undefined>(undefined)


export function useDataModelsContext() {
    const ctx = useContext(DataModelsContext)
    if (!ctx) throw new Error("useDataModelsContext must be used within DataModelsContextProvider")
    return ctx;
}


export function DataModelsContextProvider({ children }: { children: ReactNode }) {
    const value: DataModelsContextType = {

    }
    
    return React.createElement(DataModelsContext.Provider, { value: value }, children)
}

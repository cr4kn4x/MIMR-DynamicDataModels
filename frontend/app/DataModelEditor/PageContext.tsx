"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { ModelDefinition } from "../../lib/interfaces/DataModelInterfaces";

// Context-Typen
export interface DataModelEditorContextType {
  dataModel: ModelDefinition;
  setDataModel: React.Dispatch<React.SetStateAction<ModelDefinition>>;
}

export const DataModelEditorContext = createContext<DataModelEditorContextType | undefined>(undefined);

export function useDataModelEditorContext() {
  const ctx = useContext(DataModelEditorContext);
  if (!ctx) throw new Error("useDataModelEditorContext must be used within DataModelEditorProvider");
  return ctx;
}

export function DataModelEditorProvider({ children }: { children: ReactNode }) {
  const [dataModel, setDataModel] = useState<ModelDefinition>({
    name: "OverallSentiment",
    fields: [
      { name: "sentiment", type: "str", description: null },
    ],
  });
  return React.createElement(
    DataModelEditorContext.Provider,
    { value: { dataModel, setDataModel } },
    children
  );
}

"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { DataModel } from "../../lib/interfaces/DataModelInterfaces";


export interface DataModelEditorContextType {
  data_model_definition: DataModel;
  set_data_model_definition: React.Dispatch<React.SetStateAction<DataModel>>;
}



export const DataModelEditorContext = createContext<DataModelEditorContextType | undefined>(undefined);

export function useDataModelEditorContext() {
  const ctx = useContext(DataModelEditorContext);
  if (!ctx) throw new Error("useDataModelEditorContext must be used within DataModelEditorProvider");
  return ctx;
}


export function DataModelEditorProvider({ children }: { children: ReactNode }) {

  const [data_model_definition, set_data_model_definition] = useState<DataModel>({
    name: "OverallSentiment",
    fields: [
      { name: "sentiment", type: "str", description: null },
    ],
  })

  return React.createElement(
    DataModelEditorContext.Provider, { value: { data_model_definition, set_data_model_definition } }, children
  );
}

import React from "react";
import DataModelEditor from "./ModelEditor";
import { DataModelEditorProvider } from "./PageContext";

export default function DataModelEditorPage() {
  return (
    <DataModelEditorProvider>


      <div className="font-[family-name:var(--font-geist-sans)]">
        
        
        <DataModelEditor />
      </div>



    </DataModelEditorProvider>
  );
}

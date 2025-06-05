"use client"
import { Button } from "@/components/ui/button"
import { DataModel } from "./components/DataModel"
import { ProjectSelectorCombobox } from "./components/ProjectDropdown"
import { useDataModelsPageContext } from "./PageContext"
import { getAuth } from "firebase/auth"




export default function DataModelEditor() {
    const {projects, selected_project_id, set_selected_project_id} = useDataModelsPageContext()

   

    return(
        <div>
            <ProjectSelectorCombobox 
                projects={projects} 
                selected_project_id={selected_project_id} 
                set_selected_project_id={set_selected_project_id}
            />

            <div className="w-1/2 bg-gray">
                <DataModel/>
            </div>

        </div>
    )
}
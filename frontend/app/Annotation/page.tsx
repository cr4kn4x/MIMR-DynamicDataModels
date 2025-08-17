"use client"

import { useProject } from "../ProjectContext"
import { useState } from "react"
import { DataStudioWizard } from "./components/DataStudioWizard"
import { ProjectSelectorCombobox } from "@/components/my_ui/ProjectSelectorCombobox"

export default function Page() {
    const { projects, refresh_projects, selected_project_id, set_selected_project_id, data_models } = useProject()

    const [selected_input_data_model_id, set_selected_input_data_model_id] = useState<string | null>(null)
    const [selected_output_data_model_id, set_selected_output_data_model_id] = useState<string | null>(null)

    return (
        <div className="container mx-auto py-6">
            <ProjectSelectorCombobox projects={projects} refresh_projects_list={refresh_projects} selected_project_id={selected_project_id} set_selected_project_id={set_selected_project_id} />
            
            <DataStudioWizard
                input_data_model_id={selected_input_data_model_id}
                set_input_data_model_id={set_selected_input_data_model_id}
                output_data_model={selected_output_data_model_id}
                set_output_data_model={set_selected_output_data_model_id}
            />
        </div>
    )
}

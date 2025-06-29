"use client"

import { AppNavigation } from "@/components/my_ui/AppNavigation";
import DataModelEditor from "./DataModelEditor";
import { DataModelsSidebar } from "./Sidebar";
import { useDataModelsPageContext } from "./PageContext";




export default function PageContextualized() {


    const {selected_project_id, set_selected_project_id, get_and_set_projects, projects} = useDataModelsPageContext()

    return (
        <div className="h-screen w-screen flex flex-col">
            
            <AppNavigation selected_project_id={selected_project_id} set_selected_project_id={set_selected_project_id} refresh_projects_list={get_and_set_projects} projects={projects}/>

            <div className="flex-1 flex overflow-hidden min-h-0">
                <DataModelsSidebar />
                <DataModelEditor className="flex-1 h-full" />
            </div>
        </div>
    )
}
"use client";
import DataModelEditor from "./DataModelEditor";
import { AppNavigation } from "@/components/my_ui/AppNavigation";
import { DataModelsSidebar } from "./Sidebar";
import { useProject } from "../ProjectContext";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient()

export default function Page() {
    
    const { selected_project_id, set_selected_project_id, refresh_projects, projects } = useProject()


    useEffect(()=>{
        const t = async() => {
            console.log(await supabase.auth.getSession())
        }
        t()
    }, [])

    return (
        <div className="h-screen w-screen flex flex-col">
            <AppNavigation
                selected_project_id={selected_project_id}
                set_selected_project_id={set_selected_project_id}
                refresh_projects_list={refresh_projects}
                projects={projects}
            />
            <div className="flex-1 flex overflow-hidden min-h-0">
                <DataModelsSidebar />
                <DataModelEditor className="flex-1 h-full" />
            </div>
        </div>
    );
}
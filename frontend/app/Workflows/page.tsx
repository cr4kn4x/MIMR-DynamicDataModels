"use client"

import { redirect_based_on_login } from "@/lib/redirect"
import { useWorkflowPageContext} from "./PageContext"
import WorkflowsPage from "./WorkflowsPage"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProject } from "../ProjectContext"
import { AppNavigation } from "@/components/my_ui/AppNavigation"


export default function Page() {


	const router = useRouter()
	useEffect(() => {
		redirect_based_on_login(router)
	}, [])

	const {projects, refresh_projects, selected_project_id, set_selected_project_id} = useProject() 
    const {} = useWorkflowPageContext()

    return(
        <main>
            <AppNavigation projects={projects} refresh_projects_list={refresh_projects} selected_project_id={selected_project_id} set_selected_project_id={set_selected_project_id}/>
            <WorkflowsPage/>
        </main>
    )
}
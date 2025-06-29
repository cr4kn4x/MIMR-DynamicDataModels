import { AppNavigation } from "@/components/my_ui/AppNavigation";
import WorkflowsOverviewPage from "./WorkflowsOverview";
import { useWorkflowPageContext } from "./PageContext";



export default function PageContextualized() {



    const {get_and_set_projects, selected_project_id, set_selected_project_id, projects} = useWorkflowPageContext()

    return(
        <main>
            <AppNavigation projects={projects} refresh_projects_list={get_and_set_projects} selected_project_id={selected_project_id} set_selected_project_id={set_selected_project_id}/>
            <WorkflowsOverviewPage/>
        </main>
    )
}
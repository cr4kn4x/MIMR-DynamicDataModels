import { AppNavigation } from "@/components/my_ui/AppNavigation";
import WorkflowsOverviewPage from "./WorkflowsOverview";
import { useWorkflowPageContext } from "./PageContext";
import { useProject } from "../ProjectContext";



export default function PageContextualized() {


    const {selected_project_id: project_id, set_selected_project_id: set_project_id} = useProject() 

    const {get_and_set_projects, projects} = useWorkflowPageContext()

    return(
        <main>
            <AppNavigation projects={projects} refresh_projects_list={get_and_set_projects} selected_project_id={project_id} set_selected_project_id={set_project_id}/>
            <WorkflowsOverviewPage/>
        </main>
    )
}
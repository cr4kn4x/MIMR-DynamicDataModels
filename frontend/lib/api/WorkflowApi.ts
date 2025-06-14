import { Workflow } from "../interfaces/WorkflowInteraces"
import { getFirebaseBearer, raiseErrorFromResponse } from "./utils"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE



interface getWorkflowsByProjectIdResponse {
    workflows: Workflow[]
}

export async function getWorkflowsByProjectId(project_id: string): Promise<getWorkflowsByProjectIdResponse> {

    const url = `${BASE_URL}/api/workflows/get_by_project_id`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            project_id: project_id
        })
    })

    if(!response.ok) {
        await raiseErrorFromResponse(response)
    }

    const res_json = await response.json()
    return res_json
}
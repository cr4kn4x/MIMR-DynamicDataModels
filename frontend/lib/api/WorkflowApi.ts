import { LLM } from "../interfaces/LlmInterfaces"
import { Workflow } from "../interfaces/WorkflowInteraces"
import { getFirebaseBearer, raiseErrorFromApiResponse } from "./utils"

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
        await raiseErrorFromApiResponse(response)
    }

    const res_json = await response.json()
    return res_json
}




export async function addLlm(alias: string, model_name: string, base_url: string, api_key: string): Promise<Boolean> {

    // 
    const url = `${BASE_URL}/api/llms/add`

    // 
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            alias: alias, 
            model_name: model_name, 
            base_url: base_url, 
            api_key: api_key
        })
    })
    
    if(!response.ok) {
        await raiseErrorFromApiResponse(response)
    }

    const res_json = await response.json()
    return res_json
}


interface getLlmsResponse {
    llms: LLM[]
}

export async function getLlms(): Promise<getLlmsResponse> {

    const url = `${BASE_URL}/api/llms/get`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({

        })
    })

    if(!response.ok) {
        await raiseErrorFromApiResponse(response)
    }

    const res_json = await response.json()
    return res_json
}
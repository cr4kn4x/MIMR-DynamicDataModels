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


interface getWorkflowByIdResponse {
    workflow: Workflow
}

export async function getWorkflowById(workflow_id: string): Promise<getWorkflowByIdResponse> {

    const url = `${BASE_URL}/api/workflows/get_by_id`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workflow_id: workflow_id
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



export async function createWorkflow(project_id: string, llm: string, input_data_model: string, output_data_model: string, active: boolean, name: string) {

    const url = `${BASE_URL}/api/workflows/create`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            project_id: project_id,
            llm: llm, 
            input_data_model: input_data_model, 
            output_data_model: output_data_model, 
            active: active, 
            name: name
        })
    })
    
    if(!response.ok) {
        await raiseErrorFromApiResponse(response)
    }
    
    return true
}

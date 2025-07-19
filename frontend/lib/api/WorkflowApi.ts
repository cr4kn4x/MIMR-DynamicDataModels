import { LLM } from "../interfaces/LlmInterfaces"
import { Workflow, WorkflowApiKey } from "../interfaces/WorkflowInteraces"
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

interface CreateWorkflowResponse {
    msg: string, 
    id: string
}

export async function createWorkflow(project_id: string, llm: string, input_data_model: string, output_data_model: string, active: boolean, name: string): Promise<CreateWorkflowResponse> {

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
    
    const res = await response.json() 
    return res
}


interface CreateAccessTokenResponse {
    api_key: string
}

export async function createWorkflowAccessToken(workflow_id: string, key_name: string): Promise<CreateAccessTokenResponse> {
    const url = `${BASE_URL}/api/workflows/security/create_access_token`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workflow_id: workflow_id,
            key_name: key_name
        })
    })

    if(!response.ok) {
        await raiseErrorFromApiResponse(response)
    }

    const res_json = await response.json()
    return res_json
}



interface GetWorkflowAccessTokensPreviewResponse {
    api_keys: WorkflowApiKey[]
}

export async function getWorkflowAccessTokensPreview(workflow_id: string): Promise<GetWorkflowAccessTokensPreviewResponse> {
    const url = `${BASE_URL}/api/workflows/security/access_tokens_preview`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workflow_id: workflow_id,
        })
    })

    if(!response.ok) {
        await raiseErrorFromApiResponse(response)
    }

    const res_json = await response.json()
    return res_json
}



export async function refreshWorkflowAccessToken(key_id: string): Promise<CreateAccessTokenResponse> {
    const url = `${BASE_URL}/api/workflows/security/refresh_access_token`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key_id: key_id
        })
    })

    if(!response.ok) {
        await raiseErrorFromApiResponse(response)
    }

    const res_json = await response.json()
    return res_json
} 


export async function deleteWorkflowAccessToken(key_id: string) {
    const url = `${BASE_URL}/api/workflows/security/delete_access_token`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key_id: key_id
        })
    })

    if(!response.ok) {
        await raiseErrorFromApiResponse(response)
    }

    const res_json = await response.json()
    return res_json
} 


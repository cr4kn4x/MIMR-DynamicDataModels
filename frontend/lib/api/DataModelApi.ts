import { DataModel, DataModelField, Project } from "../interfaces/DataModelInterfaces";
import { getFirebaseBearer, raiseErrorFromResponse } from "./utils";


const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE

// TO-DO: 1.) Auch bei erfolg msg durchreichen und potenziell als toast oder zumindest in der Konsole ausgeben. 

interface getAllProjectsResponse {
    projects: Project[]
}

export async function getAllProjects(): Promise<getAllProjectsResponse> {
    const url = `${BASE_URL}/api/project/get_all`

    const response = await fetch(url, {
        method: "GET",
        headers: {"Authorization": await getFirebaseBearer()}
    })

    if (!response.ok) { await raiseErrorFromResponse(response) }

    const res_json = await response.json()
    return res_json
}


export async function createNewProject(project_name: string) {
    const url = `${BASE_URL}/api/project/create`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            project_name: project_name
        })
    })

    if (!response.ok) { 
        await raiseErrorFromResponse(response)
    }
    
    return true
}


export async function createNewDataModel(project_id: string, data_model_name: string){
    const url = `${BASE_URL}/api/data_models/create`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            project_id: project_id,
            data_model_name: data_model_name
        })
    })

    if(!response.ok) {
        await raiseErrorFromResponse(response)
    }
    
    return true
}



interface getDataModelsByProjectIdResponse {
    data_models: DataModel[]
}

export async function getDataModelsByProjectId(project_id: string): Promise<getDataModelsByProjectIdResponse> {
    
    const url = `${BASE_URL}/api/data_models/get_by_project_id`

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




export async function applyChangesToDataModelField(ass_data_model_id: string, new_field: DataModelField) {
    const url = `${BASE_URL}/api/data_models/change_field`

    const response = await fetch(url, {
        method: "POST", 
        headers: {
            "Authorization": await getFirebaseBearer(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ass_data_model_id: ass_data_model_id, 
            new_field: new_field
        })
    })

    if(!response.ok) {
        await raiseErrorFromResponse(response)
    }

    return true
}


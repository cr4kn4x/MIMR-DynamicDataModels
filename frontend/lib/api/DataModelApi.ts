import { DataModel, Project } from "../interfaces/DataModelInterfaces";
import { getFirebaseBearer, raiseErrorFromResponse } from "./utils";


const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE




export async function getAllProjects(): Promise<Project[]> {
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

import { getAuth } from "firebase/auth"


export async function getFirebaseBearer() {
    const token = await getAuth().currentUser?.getIdToken()
    if(!token){ throw Error("Firebase Token not accessible by client") }

    return `Bearer ${token}`
}


export async function raiseErrorFromApiResponse(response: Response): Promise<never> {
    let error_msg = "Request failed (ERROR)"

    try{
        const res_json = await response.json()
        if(res_json && res_json.msg){
            error_msg = `${res_json.msg} (${response.status} ${response.statusText})`
        }
        else{
            error_msg = `${response.status} ${response.statusText}`
        }
    }
    catch{
        error_msg = `${response.status} ${response.statusText}`
    }

    throw new Error(error_msg)
}



export function generateErrorText(e: any){
    const error_msg = e instanceof Error ? e.message : String(e)

    return error_msg
}
import { createClient } from "@/utils/supabase/client"



export async function getSupabaseBearer() {
    const supabase = createClient()

    const {data, error} = await supabase.auth.getSession()

    if(error || !data.session?.access_token){
        throw Error("Supabse Token not accessible by client")
    }

    return `Bearer ${data.session.access_token}`
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
    let error_msg = "Unknown error occurred"
    
    if (e instanceof Error) {
        error_msg = e.message
    } else if (typeof e === 'string') {
        error_msg = e
    } else if (e && typeof e === 'object' && 'message' in e) {
        error_msg = String(e.message)
    }

    return error_msg
}
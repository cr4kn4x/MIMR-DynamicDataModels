import { raiseErrorFromApiResponse } from "./utils"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE



interface EmailRegistrationStatusResponse {
    registered: boolean
    email_confirmed: boolean
}


export async function getUserRegistrationStatus(email: string): Promise<EmailRegistrationStatusResponse> {
    const url = `${BASE_URL}/api/auth/check_registration_status`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    })

    if (!response.ok) { await raiseErrorFromApiResponse(response) }

    const res_json = await response.json()
    return res_json
}

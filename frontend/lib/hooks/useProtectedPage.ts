import { useRouter } from "next/navigation"
import { supabase } from "../supabaseClient"
import { useEffect, useState } from "react"



export default function useProtectedPage() {
    const router = useRouter()

    const [authenticated, set_authenticated] = useState<boolean>(false)
    const [loading, set_loading] = useState<boolean>()

    useEffect(() => {

        const check_auth = async () => {
            const { data: user_data, error } = await supabase.auth.getUser() 
            if(!user_data || error) {
                router.push("/Login")
            }
        }

        // initial call
        check_auth()

        const { data } = supabase.auth.onAuthStateChange((e) => {
            check_auth()
        })

        // 
        return () => {
            data.subscription.unsubscribe()
        }
    }, [router])

}
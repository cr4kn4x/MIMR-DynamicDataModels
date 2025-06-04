import { getAuth } from "firebase/auth"
import firebaseApp from "@/lib/firebase"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"


export function redirect_based_on_login(router: AppRouterInstance) {
    const auth = getAuth(firebaseApp)
    
    if (!auth.currentUser) {
        router.push("/Login")
    }
}
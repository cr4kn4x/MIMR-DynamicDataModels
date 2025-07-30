import { toast } from "sonner";
import { generateErrorText } from "./utils";
import { PostgrestError } from "@supabase/supabase-js";



export async function apiCallWrapper<T>(
    promise: Promise<T>,
    toaster: typeof toast,
    error_title: string,
    setter?: (data: T) => void
) {
    try {
        const res = await promise
        
        if(setter && res){setter(res)}

        return res
    }
    catch (e: any) {
        toaster.error(error_title, { richColors: true, description: generateErrorText(e) })
    }
}
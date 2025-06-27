import { toast } from "sonner";
import { generateErrorText } from "./utils";



export async function apiCallWrapper<T>(
  promise: Promise<T>,
  toaster: typeof toast,
  error_title: string,
) {
  try {
    const res = await promise
    return res
  }
  catch(e: any) {
    toaster.error(error_title, {richColors: true, description: generateErrorText(e)})
  }
}
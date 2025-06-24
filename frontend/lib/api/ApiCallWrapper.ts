import { toast } from "sonner";
import { generateErrorText } from "./utils";



export async function apiWrapper<T>(
  apiCall: () => Promise<T>,
  onSuccess: (result: T) => void,
  toaster: typeof toast,
  errorMsg = "API call failed"
) {
  try {
    const result = await apiCall();
    onSuccess(result);
    return result;
  } catch (e) {
    const msg = generateErrorText(e);
    toaster.error(errorMsg, { description: msg });
    throw e;
  }
}
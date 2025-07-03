import { AlertCircle, CheckCircle } from "lucide-react"


interface InputValidationStatusProps {
    input_valid: boolean
    status: string
}

export default function InputValidationStatus({input_valid, status}: InputValidationStatusProps){
    return(
        <div>
        {
            (!input_valid)? 
                (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {status}
                    </span>
                ): 
                (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> {status}
                    </span>
                )
        }
        </div>
    )
}
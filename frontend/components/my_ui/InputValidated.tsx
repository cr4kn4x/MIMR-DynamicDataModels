import * as React from "react"
import { Input } from "../ui/input"
import { ZodType } from "zod"



type InputValidatedProps = React.ComponentProps<"input"> & {
    zod: ZodType<any>
    value: any

    set_input_valid: (v: boolean) => void
}


export default function InputValidated({ className, value, zod, set_input_valid, type, ...props }: InputValidatedProps) {
    
    
    const [error, set_error] = React.useState<string|null>(null)

    React.useEffect(() => {
        const result = zod.safeParse(value)
        set_error(result.success ? null : result.error.errors[0]?.message)
        set_input_valid(result.success)
    }, [value, zod])

    // border color logic 
    let border_color = "border-gray-300"
    if (error) {
        border_color = "border-red-500"
    }
    else if (!error) {
        border_color = "border-green-500"
    }

    const [touched, set_touched] = React.useState(false)

    return (
        <div className="flex flex-col" onClick={()=>{set_touched(true)}}>
            <Input
                {...props}
                value={value}
                type={type}
                className={(touched)? `focus-visible:${border_color} ${border_color} ${className ?? ""}`: ""}
            />
            {touched && error && (
                <span className="text-sm text-red-500 mt-1">{error}</span>
            )}
        </div>
    )
}
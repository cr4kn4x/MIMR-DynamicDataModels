import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


interface CopyButtonProps {
    value: string,
    value_name?: string,
    toaster: typeof toast,
    className?: string,
}


export default function CopyButton({value, value_name="", toaster, className}: CopyButtonProps) {


    const copy_to_clipboard = () => {
        navigator.clipboard.writeText(value)
        toaster.info(`Copied ${value_name} to clipboard`) 
    }

    return(
        <Button variant={"ghost"} size={"icon"} onClick={copy_to_clipboard} className={cn(className)}>
            <ClipboardCopyIcon />
        </Button>
    )
}
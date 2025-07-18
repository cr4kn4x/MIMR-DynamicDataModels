import { LLM } from "@/lib/interfaces/LlmInterfaces"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select"



interface LLMSelctorProps {
    set_selected_llm_id: (id: string) => void
    selected_llm_id: string
    llms: LLM[]
}


export default function LLMSelctor({ set_selected_llm_id, selected_llm_id, llms }: LLMSelctorProps) {
    return (
        <Select value={selected_llm_id} onValueChange={set_selected_llm_id}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select LLM..." />
            </SelectTrigger>
            <SelectContent>
                {
                    llms.map((llm) => {
                        return (
                            <SelectItem key={llm.id} id={llm.id} value={llm.name}>{llm.name}</SelectItem>
                        )
                    })
                }
            </SelectContent>
        </Select>
    )
}
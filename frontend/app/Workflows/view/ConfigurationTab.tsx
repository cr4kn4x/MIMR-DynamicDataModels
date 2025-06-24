import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"
import { Workflow } from "@/lib/interfaces/WorkflowInteraces"


interface ConfigurationTabProps {
    workflow: Workflow
}

export function ConfigurationTab({ workflow }: ConfigurationTabProps) {
    
    return (
        <div>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>

                <div className="flex items-center space-x-4">
                    <Label className="font-semibold">Active</Label>
                    <Switch className="text-green-300"/>
                </div>

                <div>
                    <Label className="block text-xs font-medium text-gray-700 mb-1">Workflow Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Person Extraction" required />
                </div>
        
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LLM Auswahl</label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="LLM wählen..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="llama-3">Llama 3</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Input DataModel</label>
                    <Input value={""} placeholder="Input Model Name" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Output DataModel</label>
                    <Input value={""} placeholder="Output Model Name" required />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={() => window.history.back()}>Abbrechen</Button>
                    <Button type="submit">Speichern</Button>
                </div>
            </form>
        </div>
    )
}
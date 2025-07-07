import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { DataModelSelectorCombobox } from "@/components/my_ui/DataModelSelectorCombobox"
import { getDataModelsByProjectId } from "@/lib/api/DataModelApi"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { useRouter, useSearchParams } from "next/navigation"
import { DataModelCard } from "@/components/my_ui/DataModelCard"
import { createWorkflow, getLlms } from "@/lib/api/WorkflowApi"
import { LLM } from "@/lib/interfaces/LlmInterfaces"
import { toast } from "sonner"
import { viewWorkflowPageContext } from "./PageContext";
import { useProject } from "@/app/ProjectContext"
import { useWorkflowValidation } from "@/lib/hooks/input-validation/useWorkflowValidation";
import { useWorkflowPageContext, WorkflowPageContext } from "../PageContext"
import InputValidationStatus from "@/components/my_ui/InputValidationStatus"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"


interface ConfigureNewWorkflowTabProps {

}


// Hilfskomponente für die JSON-Vorschau ohne Syntax-Highlighting
function ApiJsonPreview({ label, value }: { label: string, value: any }) {
    return (
        <div>
            <span className="font-semibold text-xs">{label}:</span>
            <pre className="bg-white rounded p-2 text-xs overflow-x-auto border border-gray-100 mt-1">
                <code>{JSON.stringify(value, null, 2)}</code>
            </pre>
        </div>
    );
}

export function ConfigureNewWorkflowTab({ }: ConfigureNewWorkflowTabProps) {
    
    const { selected_workflow_id, selected_workflow, create} = viewWorkflowPageContext()
    const { workflows } = useWorkflowPageContext()
    const {selected_project_id, data_models, llms, refresh_llms} = useProject()
    // valid combinations need to be checked.. it think at best in PageContext! 

    
    // 
    const [is_active, set_is_active] = useState<boolean>(true)
    const [name, set_name] = useState<string>("")
    const [selected_input_data_model_id, set_selected_input_data_model_id] = useState<string | null>(null)
    const [selected_output_data_model_id, set_selected_output_data_model_id] = useState<string | null>(null)
    const [selected_llm_id, set_selected_llm_id] = useState<string>("")

    const [is_loading, set_is_loading] = useState<boolean>(false)

    const selected_input_data_model = data_models.find((m) => m.id === selected_input_data_model_id)
    const selected_output_data_model = data_models.find((m) => m.id === selected_output_data_model_id)

    
    const router = useRouter()
    
    useEffect(()=>{
        if(selected_workflow){
            set_name(selected_workflow.name)
            set_selected_input_data_model_id(selected_workflow.input_data_model)
            set_selected_output_data_model_id(selected_workflow.output_data_model)
            set_selected_llm_id(selected_workflow.llm)
        }
    }, [selected_workflow])


    function generateExampleFromDataModel(dataModel: any) {
        if (!dataModel || !dataModel.fields) return {};
        return dataModel.fields.reduce((acc: any, field: any) => ({
            ...acc,
            [field.name]: field.type
        }), {});
    }


    async function handle_submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        if(selected_project_id == null || selected_input_data_model_id == null || selected_output_data_model_id == null){
            toast.error("Please check your inputs", {richColors: true})
            return
        }

        const res = await apiCallWrapper(createWorkflow(selected_project_id, selected_llm_id, selected_input_data_model_id, selected_output_data_model_id, is_active, name), toast, "Failed to create new Workflow")

        if(res === true){
            router.push("/Workflows")
        }
    }



    const { name_validation, llm_validation, input_data_model_validation, output_data_model_validation, input_valid } = useWorkflowValidation(name, selected_llm_id, workflows, selected_input_data_model, selected_output_data_model)

    return (
        <div>
            <form className="space-y-4" onSubmit={e => { handle_submit(e) }}>

                <div className="flex items-center space-x-4">
                    <Label className="font-semibold">Active</Label>
                    <Switch checked={is_active} onCheckedChange={(c) => { set_is_active(c) }} />
                </div>

                <div>
                    <Label className="block text-sm font-medium text-gray-700">Workflow Name</Label>
                    <Input value={name} onChange={(e) => { set_name(e.target.value) }} placeholder="e.g. Sentiment Extraction" required />

                    <InputValidationStatus input_valid={name_validation.is_valid} status={name_validation.msg}/>
                </div>

                <div>
                    <Label className="block text-sm font-medium text-gray-700 my-2">Select LLM</Label>
                    <div className="flex gap-2">
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
                    </div>
                    <InputValidationStatus input_valid={llm_validation.is_valid} status={llm_validation.msg}/>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div>
                        <Label className="block text-sm font-medium mb-1">Input Data Structure</Label>
                        <DataModelSelectorCombobox data_models={data_models} combobox_title="Input Data Model" selected_data_model_id={selected_input_data_model_id} set_selected_data_model_id={set_selected_input_data_model_id} />
                        <InputValidationStatus input_valid={input_data_model_validation.is_valid} status={input_data_model_validation.msg}/>
                        <div className="mt-2">
                            {selected_input_data_model ? (
                                <DataModelCard is_selected={true} data_model={selected_input_data_model} preview={true} refresh_data_models={() => {toast.error("Unexpected call of refresh_data_models trigger")}} />
                            ) : (
                                <div className="text-gray-400 text-sm italic">Not selected</div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className={`text-sm font-medium px-2 py-1 rounded-full mb-1 ${selected_llm_id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                            {selected_llm_id || 'Select LLM'}
                        </div>

                        <div className="flex items-center">
                            <svg width="100" height="24" viewBox="0 0 100 24" className="mx-4">
                                <defs>
                                    <marker id="simpleArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                        <polygon points="0,0 6,3 0,6" fill="#6b7280" />
                                    </marker>
                                </defs>
                                <line x1="8" y1="12" x2="88" y2="12" stroke="#6b7280" strokeWidth="2" markerEnd="url(#simpleArrow)" />
                            </svg>
                            <div className="text-xs text-gray-500 absolute left-1/2 transform -translate-x-1/2 mt-6">✨AI Transformation✨</div>
                        </div>
                    </div>


                    <div>
                        <Label className="block text-sm font-medium mb-1">Output Data Structure</Label>
                        <DataModelSelectorCombobox data_models={data_models} combobox_title="Output Data Model" selected_data_model_id={selected_output_data_model_id} set_selected_data_model_id={set_selected_output_data_model_id} />
                        <InputValidationStatus input_valid={output_data_model_validation.is_valid} status={output_data_model_validation.msg}/>
                        <div className="mt-2">
                            {selected_output_data_model ? (
                                <DataModelCard is_selected={true} data_model={selected_output_data_model} preview={true} refresh_data_models={() => {toast.error("Unexpected call of refresh_data_models trigger") }} />
                            ) : (
                                <div className="text-gray-400 text-sm italic">Not selected</div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="my-2">
                    {/* API Preview Section */}
                    <div className="flex flex-col md:flex-row gap-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        {/* Request Preview */}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold mb-1 text-blue-700">Request</div>
                            <div className="text-xs text-gray-500 mb-1">POST /api/predict</div>
                            <div className="mb-1">
                                <span className="font-semibold text-xs">Headers:</span>
                                <pre className="bg-white rounded p-2 text-xs overflow-x-auto border border-gray-100 mt-1 mb-2"><code>{`Authorization: Bearer xyz\nContent-Type: application/json`}</code></pre>
                            </div>
                            <ApiJsonPreview label="Body" value={{ data: generateExampleFromDataModel(selected_input_data_model) }} />
                        </div>
                        {/* Response Preview */}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold mb-1 text-green-700">Response</div>
                            <div className="text-xs text-gray-500 mb-1">200 OK</div>
                            <ApiJsonPreview label="Body" value={{ pred: generateExampleFromDataModel(selected_output_data_model) }} />
                        </div>
                    </div>
                </div>



                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
                    {create?
                        (
                            <Button disabled={is_loading || !input_valid}>Create new Workflow</Button>
                        ):
                        (
                            <Button disabled={is_loading || !input_valid}>Save Changes</Button>
                        )
                    }
                </div>
            </form>
        </div>
    )
}
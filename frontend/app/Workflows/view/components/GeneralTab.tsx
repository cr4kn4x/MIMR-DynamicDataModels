import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { viewWorkflowPageContext } from "./../PageContext"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClipboardCopyIcon, Link1Icon, Link2Icon } from "@radix-ui/react-icons";
import CopyButton from "@/components/my_ui/CopyButton";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";



function renderJsWithTypeComments(obj: any, indent = 2): string {
    // Only works for flat objects with primitive types (for demo)
    if (!obj || typeof obj !== 'object') return '';
    const lines: string[] = ['{'];
    const keys = Object.keys(obj);
    keys.forEach((key, idx) => {
        const val = obj[key];
        let example = '';
        let type = '';
        if (typeof val === 'object' && val !== null) {
            // Nested object: recurse
            const nested = renderJsWithTypeComments(val, indent + 2);
            example = nested.replace(/\n/g, `\n${' '.repeat(indent + 2)}`);
            type = '';
        } else {
            switch (val) {
                case 'int': example = '42'; type = 'int'; break;
                case 'float': example = '3.14'; type = 'float'; break;
                case 'str': example = '"some string"'; type = 'str'; break;
                case 'bool': example = 'true'; type = 'bool'; break;
                default: example = 'null'; type = val;
            }
        }
        const comment = type ? ` // ${type}` : '';
        lines.push(`${' '.repeat(indent)}${JSON.stringify(key)}: ${example},${comment}`);
    });
    lines.push(`${' '.repeat(indent - 2)}}`);
    return lines.join('\n');
}

function ApiJsonPreview({ label, value }: { label: string, value: any }) {
    return (
        <div>
            <span className="font-semibold text-xs">{label}:</span>
            <div className="rounded p-2 text-xs overflow-x-auto border mt-1">
                <SyntaxHighlighter
                    language="js"
                    style={atomDark}
                    showLineNumbers={false}
                    customStyle={{ margin: 0, background: 'transparent', fontSize: '0.95em', fontFamily: 'Fira Mono, Menlo, monospace', padding: 0 }}
                >
                    {renderJsWithTypeComments(value)}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

function generateExampleFromDataModel(dataModel: any) {
    if (!dataModel || !dataModel.fields) return {};
    return dataModel.fields.reduce((acc: any, field: any) => ({
        ...acc,
        [field.name]: field.type
    }), {});
}



export default function GeneralTab() {
    const { selected_workflow, selected_workflow_populated } = viewWorkflowPageContext();

    const [is_open, set_is_open] = useState(true)

    return (
        <div className="w-full p-4">
            {(selected_workflow_populated && selected_workflow_populated.input_data_model && selected_workflow_populated.output_data_model) ? (
                <div>
                    <div className="w-full grid grid-cols-3 gap-5">

                        <Card className="flex flex-col gap-y-1 p-2">
                            <h1 className="font-semibold text-gray-600">Workflow Details</h1>

                            <div className="flex items-center pt-2">
                                {selected_workflow_populated.active ? (
                                    <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">Workflow Active</span>
                                ) : (
                                    <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">Workflow Inactive</span>
                                )}
                            </div>

                            <Label className="font-semibold pt-2">Workflow-Name</Label>
                            <div className="flex items-center pl-1">
                                <Input className="max-h-fit" disabled={true} value={selected_workflow_populated.name} />
                                <CopyButton value={selected_workflow_populated.name} value_name="workflow name" toaster={toast} />
                            </div>


                            <Label className="font-semibold pt-2">Workflow-ID</Label>
                            <div className="flex items-center pl-1">
                                <Input className="text-sm" disabled={true} value={selected_workflow_populated.id} />
                                <CopyButton value={selected_workflow_populated.id} value_name="workflow id" toaster={toast} />
                            </div>
                        </Card>


                        <Card className="flex flex-col gap-y-1 p-2">
                            <h1 className="font-semibold text-gray-600">Task Details</h1>

                            <Label className="font-semibold pt-2">Input Data Model</Label>
                            <div className="flex items-center pl-1">
                                <Input className="text-sm" value={selected_workflow_populated.input_data_model.name} disabled={true}></Input>
                                <a><Button variant={"ghost"} size={"icon"}><Link2Icon /></Button></a>
                            </div>

                            <Label className="font-semibold pt-2">Output Data Model</Label>
                            <div className="flex items-center pl-1">
                                <Input className="text-sm" value={selected_workflow_populated.output_data_model.name} disabled={true}></Input>
                                <a><Button variant={"ghost"} size={"icon"}><Link2Icon /></Button></a>
                            </div>
                        </Card>
                    </div>


                    <div className="my-2">
                        {/* API Preview Section */}
                        <div className="flex flex-col md:flex-row gap-6 rounded-lg p-4 border">
                            {/* Request Preview */}
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold mb-1 text-blue-700">Request (HTTP POST)</div>
                                <div className="mb-1 text-sm font-semibold flex items-center">http://localhost:3000/api/predict/{selected_workflow?.id} <CopyButton value={`http://localhost:3000/api/predict/${selected_workflow?.id}`} toaster={toast} value_name="API-URL"/></div>
                                <div className="mb-1">
                                    <span className="font-semibold text-xs">Headers:</span>
                                    <pre className="rounded p-2 text-xs overflow-x-auto border mt-1 mb-2"><code>{`Authorization: Bearer xyz\nContent-Type: application/json`}</code></pre>
                                </div>
                                <ApiJsonPreview label="Body" value={{ data: generateExampleFromDataModel(selected_workflow_populated.input_data_model) }} />
                            </div>
                            {/* Response Preview */}
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold mb-1 text-blue-700">Response</div>
                                <div className="text-xs mb-1">200 OK</div>
                                <div className="mb-1">
                                    <span className="font-semibold text-xs">Headers:</span>
                                    <pre className="rounded p-2 text-xs overflow-x-auto border mt-1 mb-2"><code>{`Content-Type: application/json`}</code></pre>
                                </div>
                                <ApiJsonPreview label="Body" value={{ pred: generateExampleFromDataModel(selected_workflow_populated.output_data_model) }} />
                            </div>
                        </div>
                    </div>

                    <Collapsible open={is_open} onOpenChange={set_is_open}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost">
                                <ChevronsUpDown />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="w-full">
                            <Card>
                                {/* Content for the collapsible card can go here */}
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            ) : (
                <div>
                    <p>No Workflow selected</p>
                </div>
            )}
        </div>
    )
}
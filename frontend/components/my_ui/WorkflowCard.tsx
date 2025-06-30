import { Workflow } from "@/lib/interfaces/WorkflowInteraces";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileTextIcon } from "@radix-ui/react-icons";
import Link from "next/link";



interface WorkflowCardProps {
    workflow: Workflow
    project_id: string
}


export function WorkflowCard({workflow, project_id}: WorkflowCardProps) {
    
    return(
        <div>
            <Link href={`/Workflows/view?project_id=${project_id}&id=${workflow.id}&create=0`}>
            <Card className="p-3 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                    <FileTextIcon className="w-5 h-5 text-gray-400" />
                    <CardTitle className="text-base font-semibold truncate leading-tight">{workflow.name}</CardTitle>
                </div>
                <CardContent className="p-0 text-xs text-gray-500 flex-1 flex flex-col justify-end">
                    <span className="italic">Workflow-ID: {workflow.id}</span>
                </CardContent>
            </Card>
            </Link>
        </div>
    )
}
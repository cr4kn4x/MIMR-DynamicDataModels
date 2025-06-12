"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { WorkflowCard } from "@/components/my_ui/WorkflowCard"
import { Workflow } from "@/lib/interfaces/WorkflowInteraces"



const dummyWorkflows: Workflow[] = [
	{ id: "1", name: "Person Extraction" },
	{ id: "", name: "Document Splitter" },
]


export default function WorkflowsPage() {
	const [workflows] = useState(dummyWorkflows)

	return (
		<div className="h-screen flex flex-col bg-gray-50">
			<header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
					<Badge variant="secondary">Prototyp</Badge>
				</div>
				<Link href={"/Workflows/view?create=true"}>
					<Button>Create New Workflow</Button>
				</Link>
			</header>
			<main className="p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-auto">
				{workflows.map((wf) => (
					<WorkflowCard key={wf.id} workflow={wf} />
				))
				}
			</main>
		</div>
	);
}

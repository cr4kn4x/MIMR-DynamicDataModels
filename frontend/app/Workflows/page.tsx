"use client"

import { redirect_based_on_login } from "@/lib/redirect"
import { WorkflowPageContextProvider } from "./PageContext"
import WorkflowsOverviewPage from "./WorkflowsOverview"
import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function WorkflowsPage() {


	const router = useRouter()


	// 
	useEffect(() => {
		redirect_based_on_login(router)
	}, [])

	return (
		<WorkflowPageContextProvider>
			<div>
				<WorkflowsOverviewPage />
			</div>
		</WorkflowPageContextProvider>
	)

}

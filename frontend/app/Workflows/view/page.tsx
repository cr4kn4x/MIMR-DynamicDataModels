"use client"

import { NewWorkflowPageContextProvider } from "./PageContext"
import PageContextualized from "./page-contextualized"


export default function NewWorkflowPage() {
  return (
    <NewWorkflowPageContextProvider>
      <PageContextualized />
    </NewWorkflowPageContextProvider>
  )
}
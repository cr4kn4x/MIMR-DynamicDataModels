"use client"



import { Badge } from "@/components/ui/badge"


export default function CreateWorkflowPage() {

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Create Workflow</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
      </header>
      <main className="flex-1 flex justify-center items-center">
        <p>...</p>
      </main>
    </div>
  );
}

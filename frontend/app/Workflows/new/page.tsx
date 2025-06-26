"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppNavigation } from "@/components/my_ui/AppNavigation"
import { ConfigureNewWorkflowTab } from "./ConfigurationTab"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getWorkflowsByProjectId } from "@/lib/api/WorkflowApi"
import { getDataModelsByProjectId } from "@/lib/api/DataModelApi"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"

export default function NewWorkflowPage() {


  const searchParams = useSearchParams()
  const project_id = searchParams.get("project_id")

  // 
  const [data_models, set_data_models] = useState<DataModel[]>([])

  const [] = useState<string>("")


  
  useEffect(() => {
    if(!project_id){
      toast.error("Invalid project id", {richColors: true})
      return
    }

    
    getDataModelsByProjectId(project_id).then((res) => {set_data_models(res.data_models)})
    .catch((e) => {toast.error("Failed to load data models", {richColors: true, description: e.message})})

  }, [project_id])



  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppNavigation title="Workflow-Editor" badge="Beta">
        
      </AppNavigation>
      
      <main className="flex-1 flex flex-col items-stretch">
        <Card className="w-full h-full rounded-none">
          <CardContent className="h-full">
            <Tabs defaultValue="config" className="w-full h-full">
              <TabsList className="mb-4">
                <TabsTrigger value="config">Konfiguration</TabsTrigger>

              </TabsList>
              <TabsContent value="config">
                <ConfigureNewWorkflowTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

/*
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{"Data Extracotr"}</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-stretch">
        <Card className="w-full h-full rounded-none">
          <CardContent className="h-full">
            <Tabs defaultValue="config" className="w-full h-full">
              <TabsList className="mb-4">
                <TabsTrigger value="config">Konfiguration</TabsTrigger>
                <TabsTrigger value="test">Test & Evaluation</TabsTrigger>
                <TabsTrigger value="runs">Durchläufe & Ergebnisse</TabsTrigger>
              </TabsList>
              <TabsContent value="config">

                {
                  url_param_create
                }


                <ConfigurationTab

                />



              </TabsContent>
              <TabsContent value="test">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Testdatensatz hochladen</label>
                    <Input type="file" />
                  </div>
                  <Button>Testlauf starten</Button>
                  <div className="pt-4">
                    <Card className="bg-gray-50">
                      <CardHeader>
                        <CardTitle>Performance Metriken</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-4">
                          <div className="p-2 bg-white rounded shadow text-center">
                            <div className="text-lg font-bold">F1</div>
                            <div className="text-2xl">0.92</div>
                          </div>
                          <div className="p-2 bg-white rounded shadow text-center">
                            <div className="text-lg font-bold">Precision</div>
                            <div className="text-2xl">0.90</div>
                          </div>
                          <div className="p-2 bg-white rounded shadow text-center">
                            <div className="text-lg font-bold">Recall</div>
                            <div className="text-2xl">0.94</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="runs">
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle>Durchläufe & Ergebnisse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Run ID</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Metrik</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {runs.map(run => (
                          <TableRow key={run.id}>
                            <TableCell>{run.id}</TableCell>
                            <TableCell>{run.date}</TableCell>
                            <TableCell>{run.status}</TableCell>
                            <TableCell>{run.metric}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
*/
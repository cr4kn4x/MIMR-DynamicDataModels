import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { useWorkflowViewerPageContext } from "./PageContext"

export function WorkflowView() {

    const {create_new, data_models, project_id} = useWorkflowViewerPageContext()
    

    return (
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
                                {create_new ? (
                                    <CreateNewTab />
                                ): (
                                    <div>

                                    </div>
                                )
                                }
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
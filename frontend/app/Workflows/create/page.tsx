"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigureNewWorkflowTab } from "./ConfigurationTab"
import { useEffect } from "react"
import { redirect_based_on_login } from "@/lib/redirect"
import { useRouter } from "next/navigation"


export default function WorkflowViewPage() {


    const router = useRouter()
    useEffect(() => {
        redirect_based_on_login(router)
    }, [])
    
    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <main className="flex-1 flex flex-col items-stretch">
                <Card className="w-full h-full rounded-none">
                    <CardContent className="h-full">
                        <Tabs defaultValue="config" className="w-full h-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="config">Configuration</TabsTrigger>
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
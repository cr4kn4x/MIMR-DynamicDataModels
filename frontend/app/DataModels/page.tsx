"use client"
import DataModelEditor from "./DataModelEditor";
import { DataModelsPageContextProvider } from "./PageContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirect_based_on_login } from "@/lib/redirect";
import { AppNavigation } from "@/components/my_ui/AppNavigation";
import { DataModelsSidebar } from "./Sidebar";



export default function Page() {


  const router = useRouter()
  useEffect(() => {
    redirect_based_on_login(router)
  }, [])





  return (
    <DataModelsPageContextProvider>
      <div className="h-screen w-screen flex flex-col">
        <AppNavigation badge="Beta" />
        <div className="flex-1 flex overflow-hidden min-h-0">
          <DataModelsSidebar />
          <DataModelEditor className="flex-1 h-full" />
        </div>
      </div>
    </DataModelsPageContextProvider>
  )
}
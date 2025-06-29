"use client"
import DataModelEditor from "./DataModelEditor";
import { DataModelsPageContextProvider } from "./PageContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirect_based_on_login } from "@/lib/redirect";
import { AppNavigation } from "@/components/my_ui/AppNavigation";
import { DataModelsSidebar } from "./Sidebar";
import { ProjectSelectorCombobox } from "@/components/my_ui/ProjectSelectorCombobox";
import { Button } from "@/components/ui/button";
import PageContextualized from "./page-contextualized";



export default function Page() {


  const router = useRouter()
  useEffect(() => {
    redirect_based_on_login(router)
  }, [])

  return (
    <DataModelsPageContextProvider>
      <PageContextualized/>
    </DataModelsPageContextProvider>
  )
}
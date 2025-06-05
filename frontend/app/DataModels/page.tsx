"use client"

import DataModelEditor from "./DataModelEditor";
import { DataModelsPageContextProvider } from "./PageContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirect_based_on_login } from "@/lib/redirect";



export default function Page() {
    //     
    const router = useRouter()


    // 
    useEffect(()=>{
        redirect_based_on_login(router)
    }, [])
   
        

    return (
        <DataModelsPageContextProvider>
            <div className="w-screen h-screen font-[family-name:var(--font-geist-sans)]">
                <DataModelEditor/>
            </div>
        </DataModelsPageContextProvider>
    )
}
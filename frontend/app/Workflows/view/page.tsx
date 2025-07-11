"use client"
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { InfoCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";
import WorkflowSidebar, { SidebarSelectionLiteral } from "./components/Sidebar";
import { useState } from "react";
import GeneralTab from "./components/GeneralTab";
import SecurityTab from "./components/SecurityTab";



export default function Page() {
    // 
    const [sidebar_selection, set_sidebar_selection] = useState<SidebarSelectionLiteral>("general")

    return (
        <div className="flex w-full h-full min-h-screen">
            <WorkflowSidebar selection={sidebar_selection} set_selection={set_sidebar_selection} />
            <main className="flex-1">
                <div className="w-full">
                    {
                        sidebar_selection === "general" ? <GeneralTab /> : null
                    }
                    {
                        sidebar_selection === "security" ? <SecurityTab /> : null
                    }
                </div>
            </main>
        </div>
    )
}
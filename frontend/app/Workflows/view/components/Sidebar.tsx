import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { InfoCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";


export type SidebarSelectionLiteral = "security" | "general"


interface WorkflowSidebarProps {
    selection: SidebarSelectionLiteral
    set_selection: (selection: SidebarSelectionLiteral) => void
}

export default function WorkflowSidebar({selection, set_selection}: WorkflowSidebarProps) {
    
    const set_selection_helper = (new_selection: SidebarSelectionLiteral) => {
        if(selection == new_selection){return}
        set_selection(new_selection)
    }
    
    return (
        <Sidebar>
            <SidebarHeader>
                
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Label</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>

                            <SidebarMenuItem onClick={()=>{set_selection_helper("general")}}>
                                <SidebarMenuButton asChild isActive={selection === "general"}>
                                    <Button className="justify-start text-left" variant={"ghost"}>
                                        <InfoCircledIcon />
                                        General
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem onClick={()=>{set_selection_helper("security")}}>
                                <SidebarMenuButton asChild isActive={selection === "security"}>
                                    <Button className="justify-start text-left" variant={"ghost"}>
                                        <LockClosedIcon />
                                        Access and Security
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    )
}
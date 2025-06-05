"use client"

import * as React from "react"
import { ChevronsUpDown, Edit3Icon, PlusSquareIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FieldDescriptionDialog } from "./FieldDescriptionDialog"

export function DataModel() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px]">
            <CollapsibleTrigger asChild>
                {/* TBD */}
            </CollapsibleTrigger>

            <Card>
                <CardHeader>
                    <CardTitle>Person</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-1">
                    <div className="grid grid-cols-4">
                        <Input disabled={true} value={"name"}/>

                        <DropdownMenu open={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"}>{"str"}</Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56" align="start">
                                 <DropdownMenuLabel>Select type</DropdownMenuLabel>
                                 <DropdownMenuGroup>
                                      <DropdownMenuItem>
                                        str
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        int
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        float
                                      </DropdownMenuItem>
                                 </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <FieldDescriptionDialog  description="sentiment value marked as positive, negative or neutral" />
                    </div>

                    <div className="grid grid-cols-4">
                        <Input disabled={true} value={"age"}/>
                    </div>
                </CardContent>
            </Card>
        </Collapsible>
    )
}


/*
<ToggleGroup type="multiple">
                    <ToggleGroupItem value="edit">
                        <Edit3Icon/>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="delete">
                        <Trash2Icon/>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="add">
                        <PlusSquareIcon/>
                    </ToggleGroupItem>
                </ToggleGroup>
*/
"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import CreateProjectDialog from "./CreateProjectDialog"
import { Project } from "@/lib/interfaces/DataModelInterfaces"






interface ProjectSelectorComboboxProps {
    projects: Project[]
    selected_project_id: string | null
    set_selected_project_id(id: string | null): void
}


export function ProjectSelectorCombobox({ selected_project_id, set_selected_project_id, projects}: ProjectSelectorComboboxProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                        {
                            selected_project_id ? projects.find((project) => project.id === selected_project_id)?.name : "Select project"
                        }
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search project..." />
                        <CommandList>
                            <CommandEmpty>No project found.</CommandEmpty>
                            <CommandGroup>
                                {projects.map((project) => (
                                    <CommandItem
                                        key={project.id}
                                        value={project.id}
                                        onSelect={() => {
                                            set_selected_project_id(project.id)
                                            setOpen(false)
                                        }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected_project_id === project.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {project.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            

                            <CommandGroup>
                                <CreateProjectDialog/>
                            </CommandGroup>

                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}
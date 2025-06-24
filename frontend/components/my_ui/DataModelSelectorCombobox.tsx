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

import { DataModel } from "@/lib/interfaces/DataModelInterfaces"





interface DataModelSelectorComboboxInterface {
    data_models: DataModel[]
    combobox_title: string
    selected_data_model_id: string | null
    set_selected_data_model_id(id: string|null): void
}


export function DataModelSelectorCombobox({ combobox_title="Select Data Model", data_models, selected_data_model_id, set_selected_data_model_id }: DataModelSelectorComboboxInterface) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                        {
                            selected_data_model_id
                                ? data_models.find((m) => m.id === selected_data_model_id)?.name
                                : combobox_title
                        }
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search Data Model..." />
                        <CommandList>
                            <CommandEmpty>No Data Models found.</CommandEmpty>
                            <CommandGroup>
                                {data_models.map((data_model) => (
                                    <CommandItem
                                        key={data_model.id}
                                        value={data_model.name}
                                        onSelect={() => {
                                            set_selected_data_model_id(data_model.id)
                                            setOpen(false)
                                        }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected_data_model_id === data_model.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {data_model.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}
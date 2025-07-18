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
    combobox_title?: string
    selected_data_model_id: string | null
    set_selected_data_model_id(id: string|null): void
    className?: string
}


export function DataModelSelectorCombobox({ combobox_title = "Select DataModel...", data_models, selected_data_model_id, set_selected_data_model_id, className }: DataModelSelectorComboboxInterface) {
    const [open, setOpen] = React.useState(false)

    // Filter data models that end with "(native)"
    const nativeDataModels = data_models.filter(dm => dm.name.endsWith('(native)'))
    const customDataModels = data_models.filter(dm => !dm.name.endsWith('(native)'))

    return (
        <div className={cn(className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button role="combobox" aria-expanded={open} className="justify-between w-full text-xs">
                        {
                            selected_data_model_id
                                ? data_models.find((m) => m.id === selected_data_model_id)?.name
                                : combobox_title
                        }
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 left-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search Data Model..." />
                        <CommandList>
                            <CommandEmpty>No Data Models found.</CommandEmpty>
                            {nativeDataModels.length > 0 && (
                                <CommandGroup heading="Native Data Models">
                                    {nativeDataModels.map((data_model) => (
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
                            )}

                            {customDataModels.length > 0 && (
                                <CommandGroup heading="Data Models">
                                    {customDataModels.map((data_model) => (
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
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PlusIcon } from "lucide-react"
import { DataModelField } from "@/lib/interfaces/DataModelInterfaces"

interface CreateFieldDialogProps {
    onAddField: (field: Omit<DataModelField, 'id'>) => void
    trigger?: React.ReactNode
}

// Häufige Pydantic/Python Typen
const FIELD_TYPES = [
    { value: "str", label: "String" },
    { value: "int", label: "Integer" },
    { value: "float", label: "Float" },
    { value: "bool", label: "Boolean" },
    { value: "datetime", label: "DateTime" },
    { value: "date", label: "Date" },
    { value: "List[str]", label: "List of Strings" },
    { value: "List[int]", label: "List of Integers" },
    { value: "Optional[str]", label: "Optional String" },
    { value: "Optional[int]", label: "Optional Integer" },
    { value: "Optional[float]", label: "Optional Float" },
    { value: "Union[str, int]", label: "String or Integer" },
    { value: "Dict[str, Any]", label: "Dictionary" },
]

export default function CreateFieldDialog({ onAddField, trigger }: CreateFieldDialogProps) {
    const [open, setOpen] = useState(false)
    const [fieldName, setFieldName] = useState("")
    const [fieldType, setFieldType] = useState("")
    const [fieldDescription, setFieldDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!fieldName.trim() || !fieldType) {
            return
        }

        setIsLoading(true)
        
        try {
            // Hier würde normalerweise der API Call stehen
            const newField: Omit<DataModelField, 'id'> = {
                name: fieldName.trim(),
                type: fieldType,
                description: fieldDescription.trim() || null
            }
            
            onAddField(newField)
            
            // Reset form
            setFieldName("")
            setFieldType("")
            setFieldDescription("")
            setOpen(false)
        } catch (error) {
            console.error("Error adding field:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const defaultTrigger = (
        <Button size="sm" variant="ghost" className="w-full mt-2 h-7 text-xs">
            <PlusIcon className="w-3 h-3 mr-1" />
            Add Field
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Field</DialogTitle>
                    <DialogDescription>
                        Define a new field for your data model
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="field-name">Field Name *</Label>
                        <Input
                            id="field-name"
                            placeholder="e.g., username, email, age"
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="field-type">Field Type *</Label>
                        <Select value={fieldType} onValueChange={setFieldType} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a field type" />
                            </SelectTrigger>
                            <SelectContent>
                                {FIELD_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="field-description">Description (Optional)</Label>
                        <Textarea
                            id="field-description"
                            placeholder="Describe what this field represents..."
                            value={fieldDescription}
                            onChange={(e) => setFieldDescription(e.target.value)}
                            className="min-h-[60px]"
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            type="submit" 
                            disabled={!fieldName.trim() || !fieldType || isLoading}
                        >
                            {isLoading ? "Adding..." : "Add Field"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

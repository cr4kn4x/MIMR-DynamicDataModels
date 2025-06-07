
import { DataModelField } from "@/lib/interfaces/DataModelInterfaces"
import { Badge } from "@/components/ui/badge"


interface EditableFieldProps {
    field: DataModelField
}


export function ReadOnlyDataModelField({ field }: EditableFieldProps) {
    return (
        <div className="group">
            <div className="gap-1 items-center text-xs bg-gray-50 rounded px-1 cursor-pointer transition-colors">
                <span className="font-medium">{field.name}</span>
                <Badge className="mx-2" variant="outline">{field.type}</Badge>
            </div>
        </div>
    )
}
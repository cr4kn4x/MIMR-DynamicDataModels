import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
    FileCodeIcon, 
    Edit3Icon, 
    Trash2Icon, 
    PlusIcon,
    ChevronRightIcon,
    LayersIcon
} from "lucide-react"
import CreateDataModelDialog from "./CreateDataModelDialog"




interface ProjectViewProps {
    selected_project_id: string | null
    project_data_models: DataModel[]
}


export function ProjectView({selected_project_id, project_data_models}: ProjectViewProps) {
    const [selected_model, set_selected_model] = useState<string | null>(null)
    
    
    


    if (!selected_project_id) {
        return (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <LayersIcon className="w-8 h-8 mb-2" />
                <p className="text-sm">No project selected</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {project_data_models.length === 0 ? (
                <div className="text-center py-8">
                    <FileCodeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">No data models yet</p>

                    <CreateDataModelDialog selected_project_id={selected_project_id}/>
                </div>
            ) : (
                project_data_models.map((model, index) => (
                    <Card 
                        key={model.name} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                            selected_model === model.name ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => set_selected_model(
                            selected_model === model.name ? null : model.name
                        )}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FileCodeIcon className="w-4 h-4 text-gray-600" />
                                    <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Badge variant="secondary" className="text-xs">
                                        {model.fields.length} fields
                                    </Badge>
                                    <ChevronRightIcon 
                                        className={`w-4 h-4 text-gray-400 transition-transform ${
                                            selected_model === model.name ? "rotate-90" : ""
                                        }`} 
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        
                        {selected_model === model.name && (
                            <CardContent className="pt-0">
                                <Separator className="mb-3" />
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                            Fields
                                        </span>
                                        <div className="flex space-x-1">
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                                <Edit3Icon className="w-3 h-3" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                                <Trash2Icon className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {model.fields.map((field, fieldIndex) => (
                                        <div 
                                            key={fieldIndex} 
                                            className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium text-gray-900">{field.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {field.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <Button size="sm" variant="ghost" className="w-full mt-2 h-7 text-xs">
                                        <PlusIcon className="w-3 h-3 mr-1" />
                                        Add Field
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))
            )}
        </div>
    )
}
import CreateDataModelDialog from "@/components/my_ui/CreateDataModelDialog"
import { useDataModelsPageContext } from "./PageContext"
import { DataModelCard } from "@/components/my_ui/DataModelCard"
import { FileCodeIcon } from "lucide-react"
import { useProject } from "../ProjectContext"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces";


interface DataModelListProps {
    data_models: DataModel[];
    selected_project_id: string | null;
    refresh_data_models: () => void;
    selected_data_model_id: string | null;
    set_selected_data_model_id: (id: string | null) => void;
}

function DataModelList({ data_models, selected_project_id, refresh_data_models, selected_data_model_id, set_selected_data_model_id }: DataModelListProps) {
    if (data_models.length === 0 && selected_project_id) {
        return (
            <div className="text-center py-8">
                <FileCodeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">No data models yet</p>
                <CreateDataModelDialog
                    data_models={data_models}
                    selected_project_id={selected_project_id}
                    refresh_data_models={refresh_data_models}
                />
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {selected_project_id &&
                data_models.map((model) => (
                    <DataModelCard
                        refresh_data_models={refresh_data_models}
                        key={model.name}
                        data_model={model}
                        is_selected={selected_data_model_id === model.id}
                        preview={true}
                        onSelect={() => {
                            set_selected_data_model_id(
                                selected_data_model_id === model.id ? null : model.id
                            )
                        }}
                    />
                ))}
        </div>
    )
}

export function DataModelsSidebar() {


    const { selected_project_id, data_models, refresh_data_models } = useProject()
    const { set_selected_data_model_id, selected_data_model_id } = useDataModelsPageContext()

    
    return (
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900">Data Models</h2>
                    {selected_project_id ?
                        (
                            <div>
                                <CreateDataModelDialog
                                    data_models={data_models}
                                    selected_project_id={selected_project_id}
                                    refresh_data_models={refresh_data_models}
                                />
                            </div>
                        ) : (<></>)
                    }
                </div>

                {selected_project_id ? (
                    <div className="text-sm text-gray-600">
                        Project: {selected_project_id}
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 italic">
                        Select a project to get started
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <DataModelList
                    data_models={data_models}
                    selected_project_id={selected_project_id}
                    refresh_data_models={refresh_data_models}
                    selected_data_model_id={selected_data_model_id}
                    set_selected_data_model_id={set_selected_data_model_id}
                />
            </div>
        </aside>
    )
}
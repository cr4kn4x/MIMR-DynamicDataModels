import * as React from "react";
import { Dialog } from "radix-ui";

interface DescriptionDialogProps {
    idx: number;
    description: string;
    onSave: (desc: string) => void;
    fieldName: string;
    fieldType: string;
}

const DescriptionDialog: React.FC<DescriptionDialogProps> = ({ idx, description, onSave, fieldName, fieldType }) => {
    const [draft, setDraft] = React.useState(description)
    React.useEffect(() => { setDraft(description) }, [description])

    const handleClose = (e: React.MouseEvent) => {
        if (!window.confirm("Discard changes and close without saving?")) {
            e.preventDefault()
        }
    }

    const handleSave = (e: React.MouseEvent) => {
        if (window.confirm("Save description and overwrite previous version?")) {
            onSave(draft)
        } else {
            e.preventDefault()
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className={`px-1 rounded bg-gray-900 w-[120px] ${!description ? "opacity-50" : ""}`}>
                    {description ? (
                        <span className="truncate block">{description}</span>
                    ) : (
                        <span className="italic text-gray-400">description ...</span>
                    )}
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-900 p-3 shadow-lg">
                    <Dialog.Title className="text-lg font-medium text-white mb-2">
                        Edit description of Field {fieldName} ({fieldType})
                    </Dialog.Title>
                    <textarea
                        className="w-full min-h-[120px] rounded bg-gray-800 text-white p-2 mb-4 resize-vertical"
                        placeholder="add description ..."
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <Dialog.Close asChild>
                            <button className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-600" onClick={handleClose}>close</button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <button
                                className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                                onClick={handleSave}
                            >
                                save
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default DescriptionDialog;

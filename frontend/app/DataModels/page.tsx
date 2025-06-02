import { NavigationMenu, Select } from "radix-ui";
import { DataModelsContextProvider } from "./PageContext";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { ChevronDownIcon } from "lucide-react";



export default function Page() {

    return (
        <DataModelsContextProvider>
            <div className="w-screen h-screen">


                <Select.Root>
                    <Select.Trigger
			className="inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-gray px-[15px] text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9"
		
		>
                        <Select.Value placeholder="Select Project" />
                        <Select.Icon>
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>





                </Select.Root>

            </div>
        </DataModelsContextProvider>
    )
}
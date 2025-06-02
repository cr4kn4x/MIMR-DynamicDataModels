import { DataModel } from "../interfaces/DataModelInterfaces";





export async function CheckDataModelValidity(data_model_definition: DataModel): Promise<boolean> {
    const url = "http://localhost:5000/api/pydantic/validity"

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data_model_definition: data_model_definition
        })
    })

    const res_json = await response.json()
    return res_json["is_valid"]
}

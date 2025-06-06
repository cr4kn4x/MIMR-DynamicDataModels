import typing 


class InputValidation: 

    @staticmethod
    def is_valid_project_name(project_name: any) -> typing.Tuple[bool, str | None]:
        if not isinstance(project_name, str): 
            return False, "project_name must be a valid string"

        if len(project_name) < 1:
            return False, "project_name cannot be empty"

        if len(project_name) > 64: 
            return False, "max length of project_name is 64 characters"
        
        return True, None
    

    @staticmethod
    def is_valid_data_model_name(data_model_name: str) -> typing.Tuple[bool, str | None]:
        if not isinstance(data_model_name, str): 
            return False, "data_model_name must be a valid string"

        if len(data_model_name) < 1:
            return False, "data_model_name cannot be empty"

        if len(data_model_name) > 64: 
            return False, "max length of data_model_name is 64 characters"
        
        return True, None
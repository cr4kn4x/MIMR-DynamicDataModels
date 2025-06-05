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
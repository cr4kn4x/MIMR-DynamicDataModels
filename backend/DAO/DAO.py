import psycopg, typing, uuid, inspect, psycopg.rows
from DAO.Exceptions import (
    handle_database_error, 
    DAOException,
    DAOValidationException,
    DAODuplicateResourceException,
)


def dao_exception_handler(func):
    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except DAOException as e:
            raise e
        except Exception as e:
            handle_database_error(e, context=func.__name__)
            raise e
    return wrapper


class DAO:
    def __init__(self, dsn: str):
        self.dsn = dsn


    def __get_connection(self):
        return psycopg.connect(self.dsn, row_factory=psycopg.rows.dict_row)
      

    def __check_project_exists_by_id(self, user_id: str, project_id: str) -> bool:
        # Only used for user-friendly error messages, not for data integrity. Race conditions are handled by DB constraints.
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM projects WHERE user_id = %s and id = %s;", (user_id, project_id))
                res = cur.fetchone()
        return res is not None


    def __check_data_model_exists_by_id(self, user_id: str, data_model_id: str) -> bool: 
        # Only used for user-friendly error messages, not for data integrity. Race conditions are handled by DB constraints.
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM data_models WHERE user_id = %s and id = %s", (user_id, data_model_id))
                res = cur.fetchone() 
        return res is not None 


    def __get_data_model_fields_by_data_model_id(self, user_id: str, data_model_id: str):
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name, type, description FROM data_model_fields WHERE user_id = %s and data_model_id = %s ORDER BY name", (user_id, data_model_id))
                res = cur.fetchall()     
        return res


    def __add_fields_to_data_model(self, user_id: str, data_models: typing.List[dict]): 
        res = []
        for data_model in data_models:
            data_model["fields"] = self.__get_data_model_fields_by_data_model_id(user_id=user_id, data_model_id=data_model["id"])
            res.append(data_model)
        return res

    @dao_exception_handler
    def insert_user_if_not_exists(self, user_id: str, email: str):        
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                # 
                cur.execute(
                    "INSERT INTO users (id, email) VALUES (%s, %s) ON CONFLICT (id) DO NOTHING;",
                    (user_id, email)
                )
        return True


    @dao_exception_handler
    def insert_project(self, user_id: str, project_name: str):
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO projects(user_id, id, name) VALUES (%s, %s, %s);", (user_id, str(uuid.uuid4()), project_name))
        return True


    @dao_exception_handler
    def get_all_projects(self, user_id: str): 
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name FROM projects WHERE user_id = %s ORDER BY name", (user_id, ))
                res = cur.fetchall()
        return res
    

    @dao_exception_handler
    def insert_data_model(self, user_id: str, project_id: str, data_model_name: str): 
        if not self.__check_project_exists_by_id(user_id=user_id, project_id=project_id):
            raise DAOValidationException(f"Associated project does not exist")
        
        with self.__get_connection() as conn:
            with conn.cursor() as cur: 
                cur.execute("INSERT INTO data_models(user_id, project_id, id, name) VALUES (%s, %s, %s, %s);", 
                            (user_id, project_id, str(uuid.uuid4()), data_model_name))
        return True


    @dao_exception_handler
    def get_data_models_by_project_id(self, user_id: str, project_id: str):
        # The existence check below is only for user-friendly error messages. Data integrity and race conditions are handled by DB constraints.
        if not self.__check_project_exists_by_id(user_id=user_id, project_id=project_id): 
            raise DAOValidationException("Associated project does not exist")
        
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT project_id, id, name FROM data_models WHERE user_id = %s and project_id = %s ORDER BY name", (user_id, project_id))
                data_models = cur.fetchall()

        data_models = self.__add_fields_to_data_model(user_id, data_models=data_models)
        return data_models


    @dao_exception_handler
    def get_data_model_by_id(self, user_id: str, data_model_id: str) -> dict:
        # The existence check below is only for user-friendly error messages. Data integrity and race conditions are handled by DB constraints.
        if not self.__check_data_model_exists_by_id(user_id=user_id, data_model_id=data_model_id):
            raise DAOValidationException("Data model does not exist")
        
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT project_id, id, name FROM data_models WHERE user_id=%s and id=%s", (user_id, data_model_id))
                res = cur.fetchone()
        data_model = self.__add_fields_to_data_model(user_id=user_id, data_models=[res])[0]
        return data_model


    @dao_exception_handler
    def insert_data_model_field(self, user_id: str, data_model_id: str, field_name: str, field_type: str, field_description: str | None) -> bool:
        # The existence check below is only for user-friendly error messages. Data integrity and race conditions are handled by DB constraints.
        if not self.__check_data_model_exists_by_id(user_id=user_id, data_model_id=data_model_id):
            raise DAOValidationException("Associated data model does not exist")
        
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO data_model_fields(user_id, data_model_id, id, name, type, description) VALUES (%s, %s, %s, %s, %s, %s);",
                    (user_id, data_model_id, str(uuid.uuid4()), field_name, field_type, field_description)
                )
        return True


    @dao_exception_handler
    def change_data_model_field(self, user_id: str, field_id: str, field_name: str, field_type: str, field_description: str | None): 
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("UPDATE data_model_fields SET name=%s, type=%s, description=%s WHERE user_id=%s and id=%s", (field_name, field_type, field_description, user_id, field_id))

                if cur.rowcount == 0:
                    raise DAOValidationException(f"Data model field with id '{field_id}' does not exist")

        return True


    @dao_exception_handler
    def delete_data_model_field(self, user_id: str, field_id: str) -> bool:
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM data_model_fields WHERE user_id=%s AND id=%s", (user_id, field_id))
                if cur.rowcount == 0:
                    raise DAOValidationException(f"Data model field with id '{field_id}' does not exist")
        return True


    @dao_exception_handler
    def delete_data_model(self, user_id: str, data_model_id: str) -> bool:
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM data_models WHERE user_id=%s AND id=%s", (user_id, data_model_id))
                if cur.rowcount == 0:
                    raise DAOValidationException(f"Data model with id '{data_model_id}' does not exist")
        return True


    @dao_exception_handler 
    def delete_project(self, user_id: str, project_id: str) -> bool:
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM projects WHERE user_id=%s AND id=%s", (user_id, project_id))
                if cur.rowcount == 0:
                    raise DAOValidationException(f"Project with id '{project_id}' does not exist")
        return True
    

    @dao_exception_handler
    def get_workflows_by_project_id(self, user_id: str, project_id: str):
        # The existence check below is only for user-friendly error messages. Data integrity and race conditions are handled by DB constraints.
        if not self.__check_project_exists_by_id(user_id=user_id, project_id=project_id): 
            raise DAOValidationException("Associated project does not exist")
        
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT project_id, id, name, input_data_model, output_data_model FROM workflows WHERE user_id = %s and project_id = %s ORDER BY name", (user_id, project_id))
                workflows = cur.fetchall()

        
        return workflows
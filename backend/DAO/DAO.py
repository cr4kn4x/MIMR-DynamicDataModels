import psycopg, typing, uuid


class DAOException(Exception):
    """Base exception class for DAO operations"""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


# NOTES: DATA-MODELS (PYDANTIC) would bring more security to the DAO!


class DAO:
    def __init__(self, dsn: str):
        self.dsn = dsn


    def __get_connection(self):
        conn = psycopg.connect(self.dsn, row_factory=psycopg.rows.dict_row)
        return conn
    

    def check_user_exists(self, firebase_user_id: str) -> bool:
        """
        This function checks if the user with the firebase UID exists in the users table. 
        
        Args:
            firebase_user_id (str): Firebase UID
        
        Returns:
            bool: True if the user exists. 
        """
        with self.__get_connection() as conn:
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM users WHERE id = %s", 
                            (firebase_user_id, ))
                res = cur.fetchone()
        return res != None


    def insert_user(self, firebase_user_id: str) -> bool:
        """
        Inserts a new user with the given Firebase UID into the users table.
        Returns True if the insertion was successful, False if the user already exists.
        
        Args:
            firebase_user_id (str): The Firebase UID of the user.
        
        Returns:
            bool: True if the user was inserted, otherwise False.
        """
        try:
            with self.__get_connection() as conn: 
                with conn.cursor() as cur: 
                    cur.execute(
                        "INSERT INTO users (id) VALUES (%s)",
                        (firebase_user_id,)
                    )
            return True
        except psycopg.errors.UniqueViolation:
            return False


    def check_project_exists_by_name(self, user_id: str, project_name: str) -> bool:
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM projects WHERE user_id = %s and name = %s", (user_id, project_name))
                res = cur.fetchone() 
        return res != None


    def check_project_exists_by_id(self, user_id: str, project_id: str) -> bool: 
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM projects WHERE user_id = %s and id = %s", (user_id, project_id))
                res = cur.fetchone()
        return res != None


    def insert_project(self, user_id: str, project_name: str) -> bool:

        if self.check_project_exists_by_name(user_id=user_id, project_name=project_name): 
            raise DAOException(f"Project {project_name} already exists") 

        with self.__get_connection() as conn:
            with conn.cursor() as cur:  
                cur.execute(
                    "INSERT INTO projects(user_id, id, name) VALUES (%s, %s, %s);", (user_id, str(uuid.uuid4()), project_name)
                )
            return True
    

    def get_all_projects(self, user_id: str) -> typing.List: 
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT id, name FROM projects WHERE user_id = %s", (user_id, ))
                res = cur.fetchall()
        return res
    

    def check_data_model_exists_by_name(self, user_id: str, data_model_name: str) -> bool: 
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM data_models WHERE user_id = %s and name = %s", (user_id, data_model_name))
                res = cur.fetchone() 
            
        return res != None 
    
    def check_data_model_exists_by_id(self, user_id: str, data_model_id: str) -> bool: 
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM data_models WHERE user_id = %s and id = %s", (user_id, data_model_id))
                res = cur.fetchone() 
            
        return res != None 
    

    def insert_data_model(self, user_id: str, project_id: str, data_model_name: str): 

        if not self.check_project_exists_by_id(user_id=user_id, project_id=project_id):
            raise DAOException(f"Associated project does not exist")
        
        if self.check_data_model_exists_by_name(user_id=user_id, data_model_name=data_model_name):
            raise DAOException(f"Data Model with name {data_model_name} already exists")

        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute(
                    "INSERT INTO data_models(user_id, project_id, id, name) VALUES (%s, %s, %s, %s);", (user_id, project_id, str(uuid.uuid4()), data_model_name)
                )
        return True
    

    def get_data_models_by_project_id(self, user_id: str, project_id: str):
        if not self.check_project_exists_by_id(user_id=user_id, project_id=project_id): 
            raise DAOException("Associated project does not exist")
        
        with self.__get_connection() as conn: 
            with conn.cursor() as cur:
                cur.execute("SELECT project_id, id, name FROM data_models WHERE user_id = %s and project_id = %s", (user_id, project_id))
                res = cur.fetchall()

        return res


    def get_data_model_fields_by_id(self, user_id: str, data_model_id: str) -> typing.List:
        with self.__get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name, type, description FROM data_model_fields WHERE user_id = %s and data_model_id = %s", (user_id, data_model_id))
                res = cur.fetchall() 
                
        return res
    
    
    def insert_data_model_field(self, user_id: str, associated_data_model_id: str, field_name: str, field_type: str, field_description: str | None):

        if not self.check_data_model_exists_by_id(user_id=user_id, data_model_id=associated_data_model_id): 
            raise DAOException("Associated data model does not exist")

        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("INSERT INTO data_model_fields(user_id, data_model_id, id, name, type, description) VALUES (%s, %s, %s, %s, %s, %s);", (user_id, associated_data_model_id, str(uuid.uuid4(), field_name, field_type, field_description)))
    
        return True


# INSERT INTO public.data_model_fields(user_id, data_model_id, id, name, type, description) VALUES (%s, %s, %s, %s, %s, %s);

import psycopg, typing, uuid
from DAO import DataModels



class PsqlDAO:
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


    def check_project_exists(self, user_id: str, project_name) -> bool:
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT 1 FROM projects WHERE user_id = %s and name = %s", (user_id, project_name))
                res = cur.fetchone() 
        return res != None


    def insert_new_project(self, user_id: str, project_name: str) -> bool:
        """
        """
        with self.__get_connection() as conn:
            with conn.cursor() as cur:  
                cur.execute(
                    "INSERT INTO public.projects(user_id, id, name) VALUES (%s, %s, %s)", (user_id, str(uuid.uuid4()), project_name))
            return True
    

    def get_all_projects(self, user_id: str) -> typing.List[DataModels.ProjectDatabase]: 
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT * FROM public.projects WHERE user_id = %s", (user_id, ))
                res = cur.fetchall()
        return [DataModels.ProjectDatabase(**obj) for obj in res]
    

    






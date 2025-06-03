import psycopg
from werkzeug.security import check_password_hash






class PsqlDAO:
    def __init__(self, dsn: str):
        self.dsn = dsn


    def __get_connection(self):
        conn = psycopg.connect(self.dsn, row_factory=psycopg.rows.dict_row)
        return conn
    
    def __get_cursor(self): 
        conn = self.__get_connection()
        return conn.cursor()

    def insertUser(self, user_id: str, username: str, password_hash: str):
        with self.__get_cursor() as cur:
            cur.execute(
                    """
                    INSERT INTO users (user_id, username, password_hash)
                    VALUES (%s, %s, %s)
                    """,
                    (user_id, username, password_hash)
                )
        return True
        

    def is_username_unique(self, username: str):
        with self.__get_cursor() as cur:
            cur.execute(
                "SELECT username FROM users WHERE username = %s",
                (username,)
            )
            result = cur.fetchone()
        
        if result == None:
            return True
        return False
    

    def check_credentials(self, username: str, password: str) -> bool:
        with self.__get_cursor() as cur:
            cur.execute(
                "SELECT password_hash FROM users WHERE username = %s",
                (username,)
            )
            row = cur.fetchone()

        if row is None:
            # invalid username
            return False
        
        return check_password_hash(row["password_hash"], password)
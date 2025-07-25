import psycopg
from pydantic import BaseModel, Field



class RegistrationStatusApi(BaseModel): 
    registered: bool = Field()
    email_confirmed: bool = Field()




class SupbaseAdminDAO: 
    def __init__(self, dsn: str):
        self.dsn = dsn


    def __get_connection(self):
        return psycopg.connect(self.dsn, row_factory=psycopg.rows.dict_row)
    


    def check_registration_status_by_email(self, email: str) -> RegistrationStatusApi: 
        
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT email_confirmed_at FROM auth.users WHERE email=%s", (email, ))

                res = cur.fetchone()

        if res == None: 
            # email is not registered at all 
            return RegistrationStatusApi(registered=False, email_confirmed=False)
        
        else: 
            if res["email_confirmed_at"] != None: 
                # email is registered and confirmed
                return RegistrationStatusApi(registered=True, email_confirmed=True)
            else: 
                # email is registered but not  confirmed 
                return RegistrationStatusApi(registered=True, email_confirmed=False)
import psycopg2
from django.conf import settings 


conn = psycopg2.connect("dbname='{dbname}' user='{dbuser}' host='localhost' password='{dbpass}'".format(
                        dbname=settings.DATABASES['default']['NAME'],
                        dbuser=settings.DATABASES['default']['USER'],
                        dbpass=settings.DATABASES['default']['PASSWORD']))
cur = conn.cursor()
class Model(object):
    id = None
    _table = None

    def save():
        pass

class Person(Model):
    _table = 'person'
    fields = dict(
        name = '',
        email = '',
        status = False,
        phone = '',
        mobile_phone = '',
    )
    courses = []

    def __init__(self):
        pass

    def create(self, fields):
        query = """INSERT INTO {table} ({keys}) values ({values}) RETURNING id""".format(
            table=self._table,
            keys=", ".join(fields.keys()),
            values=", ".join(["'{}'".format(f) for f in fields.values()])
            )
        print(query)
        cur.execute(query)
        res = cur.fetchone()[0]
        conn.commit()
        return res

    def get(self, id):
        cur.execute("""SELECT * FROM {table} WHERE id = {id}""".format(table=self._table, id=id))
        return cur.fetchall()

    def list(self, limit=None, offset=None):
        cur.execute("""SELECT * FROM {table}""".format(table=self._table))
        return cur.fetchall()

    def search(self, name):
        pass


    def update(self,fields):
        pass
    

class Course(Model):
    _table = 'Courses'
    name = ''


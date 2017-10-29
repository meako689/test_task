import psycopg2
from django.conf import settings 


class Model(object):
    id = None
    _table = None

    def save():
        pass

class Person(Model):
    _table = 'person'
    name = ''
    email = ''
    status = False
    phone = ''
    mobile_phone = ''
    courses = []

    def __init__(self, **fields):
        for field, value in fields.items():
            setattr(self, field, value)

    def __str__(self):
        return self.name

class Course(Model):
    _table = 'Courses'
    name = ''

class ModelManager(object):

    def __init__(self, model):
        self.model = model
        self.conn = psycopg2.connect("dbname='{dbname}' user='{dbuser}' host='localhost' password='{dbpass}'".format(
                                dbname=settings.DATABASES['default']['NAME'],
                                dbuser=settings.DATABASES['default']['USER'],
                                dbpass=settings.DATABASES['default']['PASSWORD']))
        # self.cur = self.conn.cursor()
        self.cur = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    def create(self, fields):
        query = """INSERT INTO {table} ({keys}) values ({values}) RETURNING id""".format(
            table=self.model._table,
            keys=", ".join(fields.keys()),
            values=", ".join(["'{}'".format(f) for f in fields.values()])
            )
        self.cur.execute(query)
        res = self.cur.fetchone()[0]
        self.conn.commit()
        return res

    def get(self, id):
        self.cur.execute("""SELECT * FROM {table} WHERE id = {id}""".format(table=self.model._table, id=id))
        return self.cur.fetchall()[0]

    def list(self, limit=None, offset=None):
        query = """SELECT * FROM {table}""".format(table=self.model._table)
        if limit:
            query += " LIMIT {limit}".format(limit=limit)
        if offset:
            query += " OFFSET {offset}".format(offset=offset)
        self.cur.execute(query)
        return self.cur.fetchall()

    def search(self, field, name):
        self.cur.execute("""SELECT * FROM {table} WHERE LIKE (LOWER({field}) ,LOWER('%{name}%'))""".format(table=self.model._table, field=field, name=name))
        return self.cur.fetchall()



    def update(self, id, fields):
        self.cur.execute("""UPDATE {table} SET ({keys}) = ({values}) WHERE id = {id} """.format(table=self.model._table, 
            id=id, 
            keys=", ".join(fields.keys()),
            values=", ".join(["'{}'".format(f) for f in fields.values()])
        ))

    



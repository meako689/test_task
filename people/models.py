import psycopg2
from django.conf import settings 


class Model(object):
    id = None
    _table = None

    def save():
        pass

    def __init__(self, **fields):
        self.objects = ModelManager(self)
        for field, value in fields.items():
            setattr(self, field, value)

class Person(Model):
    _table = 'person'
    name = ''
    email = ''
    status = False
    phone = ''
    mobile_phone = ''
    courses = []


    def __repr__(self):
        return "Person: "+self.name


class Course(Model):
    _table = 'courses'
    name = ''
    code = ''

    def __repr__(self):
        return "Course: "+self.name

class PersonCourseManager(object):
    def __init__(self):
        self.conn = psycopg2.connect("dbname='{dbname}' user='{dbuser}' host='localhost' password='{dbpass}'".format(
                                dbname=settings.DATABASES['default']['NAME'],
                                dbuser=settings.DATABASES['default']['USER'],
                                dbpass=settings.DATABASES['default']['PASSWORD']))
        self.cur = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    def courses_applied(self, pk):
        self.cur.execute("""SELECT DISTINCT {table}.id, {table}.name, {table}.code FROM {table}
                                left outer join person_courses 
                                on {table}.id = person_courses.course_id 
                                where person_courses.person_id = {person_pk}""".format(
                                    table=Course._table, person_pk=pk)
                )
        return self.cur.fetchall()

    def courses_available(self, pk):
        self.cur.execute("""SELECT {table}.id, {table}.name, {table}.code FROM {table}
                                where {table}.id not in (
                                select {table}.id from {table}
                                left outer join person_courses 
                                on {table}.id = person_courses.course_id 
                                where person_courses.person_id = {person_pk})""".format(
                                    table=Course._table, person_pk=pk)
                )
        return self.cur.fetchall()

    def unsubscribe(self, pk, course_pk):
        self.cur.execute('DELETE FROM person_courses WHERE person_id = {pk} AND course_id = {course_pk}'.format(pk=pk, course_pk=course_pk))
        self.conn.commit()

    def subscribe(self, pk, course_pk):
        self.cur.execute('INSERT INTO person_courses (person_id, course_id) values ({pk},{course_pk})'.format(pk=pk, course_pk=course_pk))
        self.conn.commit()

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
        row = self.cur.fetchone()
        self.conn.commit()
        return self.get(row['id'])

    def get(self, id):
        self.cur.execute("""SELECT * FROM {table} WHERE id = {id}""".format(table=self.model._table, id=id))
        return self.model(**self.cur.fetchall()[0])

    def list(self, limit=None, offset=None):
        query = """SELECT * FROM {table}""".format(table=self.model._table)
        if limit:
            query += " LIMIT {limit}".format(limit=limit)
        if offset:
            query += " OFFSET {offset}".format(offset=offset)
        self.cur.execute(query)
        return [self.model(**itm) for itm in self.cur.fetchall()]

    def count(self):
        query = """SELECT COUNT(*) FROM {table}""".format(table=self.model._table)
        self.cur.execute(query)
        return self.cur.fetchone()['count']


    def search(self, field, query):
        self.cur.execute("""SELECT * FROM {table} WHERE LIKE (LOWER({field}), LOWER('%{query}%'))""".format(table=self.model._table, field=field, query=query))
        return [self.model(**itm) for itm in self.cur.fetchall()]

    def update(self, id, fields):
        self.cur.execute("""UPDATE {table} SET ({keys}) = ({values}) WHERE id = {id} RETURNING id """.format(table=self.model._table, 
            id=id, 
            keys=", ".join(fields.keys()),
            values=", ".join(["'{}'".format(f) for f in fields.values()])
        ))

        row = self.cur.fetchone()
        self.conn.commit()
        return self.get(row['id'])

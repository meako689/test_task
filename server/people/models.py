import psycopg2
from django.conf import settings


class Model(object):
    """Base class for db instances"""
    id = None
    _table = None

    def save():
        pass

    def __init__(self, **fields):
        self.objects = ModelManager(self)
        for field, value in fields.items():
            setattr(self, field, value)


class Person(Model):
    """Class that represents person db table, used for serialization"""
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
    """Class that represents course db table, used for serialization"""
    _table = 'courses'
    name = ''
    code = ''

    def __repr__(self):
        return "Course: "+self.name


class ModelManager(object):
    """Basic class for performing db operations on models
    This implementation uses raw sql for accessing and manipulating data

    Has implemented basic CRUD operations
    """

    def __init__(self, model):
        self.model = model
        self.conn = psycopg2.connect("dbname='{dbname}' user='{dbuser}' host='localhost' password='{dbpass}'".format(
                        dbname=settings.DATABASES['default']['NAME'],
                        dbuser=settings.DATABASES['default']['USER'],
                        dbpass=settings.DATABASES['default']['PASSWORD']))
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

    def list(self, limit=None, offset=None):
        query = """SELECT * FROM {table} ORDER BY id""".format(table=self.model._table)
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
        self.cur.execute("""SELECT * FROM {table} WHERE LIKE (LOWER({field}), LOWER('%{query}%'))""".format(
                         table=self.model._table,
                         field=field,
                         query=query))
        return [self.model(**itm) for itm in self.cur.fetchall()]

    def update(self, id, fields):
        self.cur.execute("""UPDATE {table} SET ({keys}) = ({values}) WHERE id = {id} RETURNING id """.format(table=self.model._table,
                             id=id,
                             keys=", ".join(fields.keys()),
                             values=", ".join(["'{}'".format(f) for f in fields.values()])
                            )
                        )

        row = self.cur.fetchone()
        self.conn.commit()
        return self.get(row['id'])

    def delete(self, id):
        self.cur.execute("""DELETE FROM {table} WHERE id = {id}""".format(
            table=self.model._table,
            id=id))
        self.conn.commit()


class StoredModelManager(ModelManager):
    """ModelManager that uses stored procedures instead of SQL"""

    def create(self, fields):
        query = """select * FROM create_person('{name}','{email}','{status}','{phone}','{mobile_phone}')""".format(
            name=fields.get('name'),
            email=fields.get('email'),
            status=fields.get('status'),
            phone=fields.get('phone'),
            mobile_phone=fields.get('mobile_phone')
        )
        self.cur.execute(query)
        row = self.cur.fetchone()
        self.conn.commit()
        return self.get(row['id'])

    def list(self, limit=None, offset=None):
        query = """SELECT * FROM list_person()"""
        if limit:
            query += " LIMIT {limit}".format(limit=limit)
        if offset:
            query += " OFFSET {offset}".format(offset=offset)
        self.cur.execute(query)
        return [self.model(**itm) for itm in self.cur.fetchall()]

    def search(self, field, query):
        self.cur.execute("""SELECT * FROM search_person('%{query}%')""".format(query=query))
        return [self.model(**itm) for itm in self.cur.fetchall()]

    def get(self, id):
        self.cur.execute("""SELECT * FROM get_person({id})""".format(id=id))
        return self.model(**self.cur.fetchall()[0])

    def update(self, id, fields):
        self.cur.execute("""SELECT * FROM update_person({id}, '{name}','{email}','{status}','{phone}','{mobile_phone}')""".format(
            id=id,
            name=fields.get('name'),
            email=fields.get('email'),
            status=fields.get('status'),
            phone=fields.get('phone'),
            mobile_phone=fields.get('mobile_phone')
        ))

        row = self.cur.fetchone()
        self.conn.commit()
        return self.get(row['id'])

    def count(self):
        query = """SELECT * FROM count_person()"""
        self.cur.execute(query)
        return self.cur.fetchone()['count']

    def delete(self, id):
        self.cur.execute("""SELECT * FROM delete_person({id})""".format(id=id))
        self.conn.commit()


class PersonCourseManager(ModelManager):
    """Custom manager for M2M relations between person and course"""
    def __init__(self):
        super().__init__(model=Course)

    def courses_applied(self, pk):
        self.cur.execute("""SELECT DISTINCT {table}.id, {table}.name, {table}.code FROM {table}
                                left outer join person_courses
                                on {table}.id = person_courses.course_id
                                where person_courses.person_id = {person_pk}""".format(
                                    table=self.model._table, person_pk=pk)
                        )
        return self.cur.fetchall()

    def courses_available(self, pk):
        self.cur.execute("""SELECT {table}.id, {table}.name, {table}.code FROM {table}
                                where {table}.id not in (
                                select {table}.id from {table}
                                left outer join person_courses
                                on {table}.id = person_courses.course_id
                                where person_courses.person_id = {person_pk})""".format(
                                    table=self.model._table, person_pk=pk)
                        )
        return self.cur.fetchall()

    def unsubscribe(self, pk, course_pk):
        self.cur.execute('DELETE FROM person_courses WHERE person_id = {pk} AND course_id = {course_pk}'.format(
                         pk=pk, course_pk=course_pk))
        self.conn.commit()

    def subscribe(self, pk, course_pk):
        self.cur.execute('INSERT INTO person_courses (person_id, course_id) values ({pk},{course_pk})'.format(
                         pk=pk, course_pk=course_pk))
        self.conn.commit()

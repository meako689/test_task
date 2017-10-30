CREATE TABLE person(
 id serial PRIMARY KEY,
 name VARCHAR (50) NOT NULL,
 email VARCHAR (355) UNIQUE NOT NULL,
 status BOOLEAN NOT NULL,
 phone VARCHAR (13) NOT NULL,
 mobile_phone VARCHAR (13) NOT NULL
);

CREATE TABLE courses(
 id serial PRIMARY KEY,
 name VARCHAR (50) NOT NULL,
 code VARCHAR (10) NOT NULL
)

CREATE TABLE person_courses(
 id serial PRIMARY KEY,
 person_id INTEGER,
 course_id INTEGER
)


# list people
CREATE OR REPLACE FUNCTION list_person() RETURNS SETOF person AS
$BODY$
BEGIN
RETURN QUERY SELECT * from person ORDER BY person.id;
END; 
$BODY$
LANGUAGE 'plpgsql';


#search people
CREATE OR REPLACE FUNCTION search_person(p_query VARCHAR) RETURNS SETOF person AS
$BODY$
BEGIN
RETURN QUERY 
SELECT * FROM person WHERE LIKE (LOWER(name), LOWER(p_query));
END; 
$BODY$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION create_person(
    p_name  VARCHAR,
    p_email  VARCHAR,
    p_status  BOOLEAN,
    p_phone  VARCHAR,
    p_mobile_phone  VARCHAR)
RETURNS TABLE (id integer) AS
$BODY$
BEGIN
RETURN QUERY 
INSERT INTO person (name, email, status, phone, mobile_phone) values (p_name, p_email, p_status, p_phone, p_mobile_phone) RETURNING person.id;
END; 
$BODY$
LANGUAGE 'plpgsql';


#get person
CREATE OR REPLACE FUNCTION get_person(p_id INTEGER) RETURNS SETOF person AS
$BODY$
BEGIN
RETURN QUERY 
        SELECT * FROM person WHERE id = p_id;
END; 
$BODY$
LANGUAGE 'plpgsql';



#update
CREATE OR REPLACE FUNCTION update_person(
    p_id INTEGER,
    p_name  VARCHAR,
    p_email  VARCHAR,
    p_status  BOOLEAN,
    p_phone  VARCHAR,
    p_mobile_phone  VARCHAR)
RETURNS TABLE (id integer) AS
$BODY$
BEGIN
RETURN QUERY 
UPDATE person SET (name, email, status, phone, mobile_phone) = (p_name, p_email, p_status, p_phone, p_mobile_phone) WHERE person.id=p_id RETURNING person.id;
END; 
$BODY$
LANGUAGE 'plpgsql';



# count people
CREATE OR REPLACE FUNCTION count_person() RETURNS TABLE (count BIGINT) AS
$BODY$
BEGIN
RETURN QUERY 
SELECT COUNT(id) FROM person;
END; 
$BODY$
LANGUAGE 'plpgsql';



#delete person
CREATE OR REPLACE FUNCTION delete_person(p_id INTEGER) RETURNS VOID AS
$BODY$
BEGIN
DELETE FROM person WHERE person.id = p_id;
END; 
$BODY$
LANGUAGE 'plpgsql';


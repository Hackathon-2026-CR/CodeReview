users:

name 
password
credits default: 200
groups: list [names of company he works for] default: None
price: int [how much he ask per review]  default: None
rating [from 0.1 to 5.0] default: None
languages: list, default: empty list



tasks:

title
user name
languages: list
description
groups[who can review the code] default: public
status: [waiting for review, review in process, reviwed] default: waiting for review
reviewer: default: None
price: int [how much he willing to pay for a review]



title, user_name ,languages, description, groups, status, price




reviews: [only available to the client and the reviewer]

client name
reviewer name
text to describe the code: [from 'codes'] 
groups of code
reviewer commant 
rating of the review: [the client rate the reviewer]





<!-- list of codes: list [default empty] -->


users:

name 
password
credits
groups: 
price: int 
rating [from 0.1 to 5.0] 
languages: list



tasks:

title
user name
languages
description
groups[who can review the code] default: public
status:
reviewer: default: None
price: int 


-------------------------------------

from hacaton.utils.connection import get_connection
import mysql.connector
import json

connection, cursor =  get_connection()


def cursor_to_dict(data, key_field=None):

    if data is None:
        return None

    if isinstance(data, tuple):
        # single row
        row_dict = dict(zip(cursor.column_names, data))

        rating = row_dict.get("rating")
        if rating:
            row_dict["rating"] = float(rating)

        return row_dict

    # if data is list of rows
    dict_rows = []
    for row in data:
        row_dict = dict(zip(cursor.column_names, row))

        rating = row_dict.get("rating")
        if rating:
            row_dict["rating"] = float(rating) # make it float and not decimal

        dict_rows.append(row_dict)

    if key_field is None:
        return {"items": dict_rows}
    return {row_dict[key_field]: row_dict for row_dict in dict_rows}


def get_user(username):  # 1
    try:
        query = """
        SELECT * FROM users
        WHERE name = %s
        """
        cursor.execute(query, [username])
        row = cursor.fetchone()
        return cursor_to_dict(row)

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return {"response": "this username don't exist"}
    


def published_codes(username): # 2

    try:
        query = """
        SELECT * FROM tasks
        WHERE user_name = %s
        """

        cursor.execute(query, [username])
        answer = cursor.fetchall()
        response = []
        if answer:
            # print(f"Found {len(answer)} codes for {username}:")
            for row in answer:
                response.append(row)
            return cursor_to_dict(response, key_field="id")
        else:
            print(f"No codes found for user: {username}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")


a = published_codes('jacob')
print(a)

def working_on(username): # 3

    try:
        query = """
        SELECT * FROM tasks
        WHERE reviewer_name = %s
        """

        cursor.execute(query, [username])
        answer = cursor.fetchall()
        response = []
        if answer:
            for row in answer:
                response.append(row)
        else:
            print(f"No codes found for reviewer: {username}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")




def add_task_to_codes(task): 
    try:
        insert_query = """
        INSERT INTO tasks (title, user_name, languages, description, `groups`, price)
        VALUES (%(title)s, %(user_name)s, %(languages)s, %(description)s, %(groups)s, %(price)s)
        """

        task['languages'] = json.dumps(task['languages'])
        task['groups'] = json.dumps(task['groups'])

        cursor.execute(insert_query, task)
        connection.commit()
        
        return {"response": f"task '{task['title']}' added"}

    except mysql.connector.Error as err:
        return f"Database error: {err}"




def get_available_by_user(username): # 5
    try:
        user = """
        SELECT groups FROM users
        WHERE user = %s
        """
        cursor.execute(user, [username])
        groups = cursor.fetchone()

        query = """
        SELECT t.* 
        FROM tasks t
        JOIN users u ON u.name = %s
        WHERE JSON_OVERLAPS(t.groups, u.`groups`) 
           OR JSON_CONTAINS(t.groups, '"public"');
        """
        cursor.execute(query, groups)
        answer = cursor.fetchall()
        response = []
        if answer:
            for row in answer:
                response.append(row)
            return response
        
        else:
            print(f"No codes found for reviewer: {username}")

    except mysql.connector.Error as err:
        return f"Database error: {err}"


def get_task_by_id(id): # 6
    try:
        query = """
        SELECT * FROM users
        WHERE id = %s
        """

        cursor.execute(query, [id])
        answer = cursor.fetchone()
        return answer

    except mysql.connector.Error as err:
        print(f"Database error: {err}")





# python -m querys.dal 



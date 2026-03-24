from hacaton.utils.connection import get_connection
from querys.moduls import TaskCreate
import mysql.connector
import json
from fastapi import APIRouter, Form, File, UploadFile


connection, cursor =  get_connection()

def cursor_to_dict(data):
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
    response = []
    for row in data:
        row_dict = dict(zip(cursor.column_names, row))

        rating = row_dict.get("rating")
        if rating:
            row_dict["rating"] = float(rating) # make it float and not decimal

        response.append(row_dict)

    return response

def get_user(username):  # 1
    try:
        query = """
        SELECT * FROM users
        WHERE name = %s
        """
        print(cursor)
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
            return cursor_to_dict(response)
        else:
            print(f"No codes found for user: {username}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")


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
            cursor_to_dict(response)
        else:
            print(f"No codes found for reviewer: {username}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")




def add_task_to_codes(task: TaskCreate): # 4
    try:
        insert_query = """
        INSERT INTO tasks (title, user_name, languages, description, `groups`, price)
        VALUES (%(title)s, %(user_name)s, %(languages)s, %(description)s, %(groups)s, %(price)s)
        """

        task = task.model_dump()
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
            cursor_to_dict(response)
        
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
        cursor_to_dict(answer)

    except mysql.connector.Error as err:
        print(f"Database error: {err}")

# 7
import json

def add_task_upload_file(file: UploadFile):
    try:
        file_content = file.file.read().decode('utf-8')
        task_data = json.loads(file_content) 

        task_dict = {
            "title": task_data["title"],
            "user_name": task_data["user_name"],
            "languages": json.dumps(task_data["languages"]),
            "description": task_data.get("description"),
            "groups": json.dumps(task_data["groups"]),
            "price": task_data["price"]
        }

        insert_query = """
        INSERT INTO tasks (title, user_name, languages, description, `groups`, price)
        VALUES (%(title)s, %(user_name)s, %(languages)s, %(description)s, %(groups)s, %(price)s)
        """

        cursor.execute(insert_query, task_dict)
        connection.commit()
        
        return {
            "response": f"task '{task_dict['title']}' added"
        }
    except json.JSONDecodeError as err:
        return {"error": f"Invalid JSON: {err}"}
    except Exception as err:
        return {"error": str(err)}


# ---------------------------------------------------------------------


def add_new_task(
    title: str, user_name: str, languages: str,
    description: str | None, groups: str, price: int
):
    try:
        
        task_dict = {
            "title": title,                    
            "user_name": user_name,
            "languages": json.dumps(languages.split(",")),
            "description": description,
            "groups": json.dumps(groups.split(",")),
            "price": price,
        }

        insert_query = """
        INSERT INTO tasks (title, user_name, languages, description, `groups`, price, code_content)
        VALUES (%(title)s, %(user_name)s, %(languages)s, %(description)s, %(groups)s, %(price)s, %(code_content)s)
        """

        cursor.execute(insert_query, task_dict)
        connection.commit()
        
        return {
            "response": f"task '{task_dict['title']}' added"
        }
    except Exception as err:
        return {"error from dal": str(err)}
    
    
# python -m querys.dal 



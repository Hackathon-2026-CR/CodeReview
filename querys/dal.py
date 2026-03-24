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


def working_on(reviwer_name): # 3

    try:
        query = """
        SELECT * FROM tasks
        WHERE reviewer = %s AND status = 'review in process'
        """

        cursor.execute(query, [reviwer_name])
        answer = cursor.fetchall()
        response = []
        if answer:
            for row in answer:
                response.append(row)
            return cursor_to_dict(response) 
        else:
            print(f"No codes found for reviewer: {reviwer_name}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")


def finished(reviwer_name): # 4

    try:
        query = """
        SELECT * FROM tasks
        WHERE reviewer = %s AND status = 'reviewed'
        """

        cursor.execute(query, [reviwer_name])
        answer = cursor.fetchall()
        response = []
        if answer:
            for row in answer:
                response.append(row)
            return cursor_to_dict(response)
        else:
            print(f"No codes found for reviewer: {reviwer_name}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")


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


def get_full_task_by_id(id): # 6
    try:
        query = """
        SELECT * FROM tasks
        WHERE id = %s
        """

        cursor.execute(query, [id])
        answer = cursor.fetchone()
        return cursor_to_dict(answer)

    except mysql.connector.Error as err:
        print(f"Database error: {err}")

# 7
# def add_task_upload_file(
#     title: str, user_name: str, languages: str,
#     description: str | None, groups: str, price: int, file: UploadFile
# ):
#     try:
#         code = file.file.read().decode('utf-8')
#         code = json.loads(code)
#         task_dict = {
#             "title": title,
#             "user_name": user_name,
#             "languages": json.dumps(languages.split(",")),
#             "description": description,
#             "groups": json.dumps(groups.split(",")),
#             "price": price,
#             "code": code
#         }
#
#         insert_query = """
#         INSERT INTO tasks (title, user_name, languages, description, `groups`, price, code)
#         VALUES (%(title)s, %(user_name)s, %(languages)s, %(description)s, %(groups)s, %(price)s, %(code)s)
#         """
#
#         cursor.execute(insert_query, task_dict)
#         connection.commit()
#
#         return {
#             "response": f"task '{task_dict['title']}' added"
#         }
#     except Exception as err:
#         return {"error from dal": str(err)}
#

# 8
def add_task_manually(task_data):  # מקבל אובייקט מסוג AddTask
    connection_result = get_connection()
    if isinstance(connection_result, tuple):
        connection = connection_result[0]
    else:
        connection = connection_result
    cursor = connection.cursor(dictionary=True)  # dictionary=True עוזר לעבוד עם שמות עמודות

    try:
        # הכנת הנתונים למסד הנתונים
        # שים לב: אנחנו הופכים רשימות ל-JSON string כפי שביקשת
        task_dict = {
            "title": task_data.title,
            "user_name": task_data.user_name,
            "languages": json.dumps(task_data.languages.split(",")),
            "description": task_data.description,
            "groups": json.dumps(task_data.groups.split(",")),
            "price": task_data.price,
            "code": task_data.code
        }

        insert_query = """
        INSERT INTO tasks (title, user_name, languages, description, `groups`, price, code)
        VALUES (%(title)s, %(user_name)s, %(languages)s, %(description)s, %(groups)s, %(price)s, %(code)s)
        """

        cursor.execute(insert_query, task_dict)
        connection.commit()

        return {
            "status": "success",
            "message": f"task '{task_data.title}' added successfully",
        }
    except Exception as err:
        return {"status": "error", "message": str(err)}


# python -m querys.dal 



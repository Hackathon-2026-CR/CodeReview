from data.hacaton.utils.connection import get_connection
from data.querys.moduls import TaskCreate, UserCreate, UserUpdate
import mysql.connector
import json
from fastapi import APIRouter, Form, File, UploadFile

connection, cursor = get_connection()


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
            row_dict["rating"] = float(rating)  # make it float and not decimal

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


def published_codes(username):  # 2

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


def working_on(reviwer_name):  # 3

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


def finished(reviwer_name):  # 4

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


def get_available_by_user(username):  # 5
    try:
        user_query = """
        SELECT `groups` FROM users
        WHERE `name` = %s
        """
        cursor.execute(user_query, (username,))
        result = cursor.fetchone()
        
        if not result:
            print(f"No user found: {username}")
            return []
        
        user_groups = json.loads(result[0])  
        
        groups_json = json.dumps(user_groups)  
        
        task_query = """
        SELECT t.* 
        FROM tasks t
        WHERE JSON_OVERLAPS(t.groups, %s)
           OR JSON_CONTAINS(t.groups, '"public"')
        """
        cursor.execute(task_query, (groups_json,))
        answer = cursor.fetchall()
        
        response = [cursor_to_dict([row])[0] for row in answer] if answer else []
        return response
        
    except mysql.connector.Error as err:
        return f"Database error: {err}"
    except json.JSONDecodeError as err:
        return f"JSON parse error: {err}"


def get_full_task_by_id(id):  # 6
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


# 8
def add_task_manually(task_data):  # מקבל אובייקט מסוג AddTask

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


def add_to_users(usercreate):
    try:
        insert_query = """
        INSERT INTO users (name, password)
        VALUES (%(name)s, %(password)s)
        """  # ← Only name/password - others use DB defaults

        user_data = {
            "name": usercreate.name,
            "password": usercreate.password
        }

        cursor.execute(insert_query, user_data)
        connection.commit()
        return {"response": f"user '{usercreate.name}' added (credits=200, groups=[], etc.)"}

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return {"error": f"Database error: {err}"}


def update_user_profile(userupdate):
    try:
        updates = []
        params = {"name": userupdate.name}

        if userupdate.groups is not None:
            updates.append("`groups` = %(groups)s")
            params["groups"] = json.dumps(userupdate.groups)
        if userupdate.price is not None:
            updates.append("price = %(price)s")
            params["price"] = userupdate.price
        if userupdate.languages is not None:
            updates.append("languages = %(languages)s")
        if userupdate.credits is not None:
            updates.append("credits = %(credits)s")
            params["credits"] = userupdate.credits

        if not updates:
            return {"response": "No fields to update"}

        query = f"UPDATE users SET {', '.join(updates)} WHERE name = %(name)s"
        cursor.execute(query, params)
        connection.commit()

        return {"response": f"Updated {cursor.rowcount} profile"} if cursor.rowcount else {
            "error": f"User '{userupdate.name}' not found"}

    except mysql.connector.Error as err:
        return {"error": str(err)}
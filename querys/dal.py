from hacaton.utils.connection import get_connection
import mysql.connector
import json

connection, cursor =  get_connection()


def get_user(username):
    try:
        query = """
        SELECT * FROM users
        WHERE name = %s
        """


        cursor.execute(query, [username])
        answer = cursor.fetchone()
        return answer

    except mysql.connector.Error as err:
        print(f"Database error: {err}")

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
            return response
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
        else:
            print(f"No codes found for reviewer: {username}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")



def add_task_to_codes(task): # 4
    try:
        insert_query = """
        INSERT INTO tasks (title, user_name ,languages, description, groups, status, price)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(insert_query, **task)
        connection.commit()
        return {"response": f"task {task['title']} added"}

    except mysql.connector.Error as err:
        return f"Database error: {err}"


def get_available_by_user(username): # 5
    try:
        user = """
        SELECT groups FROM users
        WHERE user = %s
        """
        cursor.execute(user, username)
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



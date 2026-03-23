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
        SELECT * FROM codes
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
        SELECT * FROM codes
        WHERE reviewer_name = %s
        """

        cursor.execute(query, [username])
        print('yo')
        answer = cursor.fetchall()
        response = []
        if answer:
            for row in answer:
                response.append(row)
        else:
            print(f"No codes found for reviewer: {username}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")



def working_on(username): # 3

    try:
        query = """
        SELECT * FROM codes
        WHERE reviewer_name = %s
        """

        cursor.execute(query, [username])
        print('yo')
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
        INSERT INTO codes (title, user_name ,code_languages, description, groups_of_code, status, price)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(insert_query, **task)
        connection.commit()
        return {"response": f"task {task['title']} added"}

    except mysql.connector.Error as err:
        return f"Database error: {err}"



# def get_all_tasks(task): # 4
#     try:
#         insert_query = """
#         INSERT INTO codes (title, user_name ,code_languages, description, groups_of_code, status, price)
#         VALUES (%s, %s, %s, %s, %s, %s, %s)
#         """

#         cursor.execute(insert_query, **task)
#         connection.commit()
#         return {"response": f"task {task['title']} added"}

#     except mysql.connector.Error as err:
#         return f"Database error: {err}"





# get_user('jacob')


# python -m querys.dal 





# hard coded until i get the actual data
        # # new_code_data = code
        # new_code_data = (
        #     'Jacob',                                                          # user_name
        #     json.dumps(['Python', 'Elasticsearch']),                          # code_languages
        #     'Data aggregation pipeline script, please go easy on me',         # description
        #     json.dumps(['Google', 'Amazon']),                                 # groups_of_code
        #     'waiting for review',                                             # status
        #     60                                                                # price
        # )
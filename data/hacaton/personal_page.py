import mysql.connector
from utils.connection import get_connection, close_connection
import json
import random



connection, cursor = get_connection()


def published_codes(name):

    try:
        query = """
        SELECT * FROM codes
        WHERE reviewer_name = %s
        """

        cursor.execute(query, [name])
        print('yo')
        answer = cursor.fetchall()
        if answer:
            print(f"Found {len(answer)} codes for {name}:")
            for row in answer:
                print(row)
        else:
            print(f"No codes found for reviewer: {name}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
    

# hard coded until i get the actual data
# published_codes('Jacob')

# -------------------------------------------------------------------------------

# querys:

def published_revies_in_progress(user: dict):

    try:
        query = """
        SELECT * FROM codes
        WHERE reviewer_name = %s AND status = 'review in process'
        """
        name = user['name']

        cursor.execute(query, [name])
        answer = cursor.fetchone()
        if answer:
            print('working!')
            for row in answer:
                print(row)
        else:
            print(f"No codes found for reviewer: {name}")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")

user = {'name':'jacob'}

published_codes(user)



close_connection(connection, cursor)
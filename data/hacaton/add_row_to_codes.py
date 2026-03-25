import mysql.connector
from utils.connection import get_connection, close_connection
import json

connection, cursor =  get_connection()

def add_to_codes(code):
    try:
        insert_query = """
        INSERT INTO codes (user_name, code_languages, description, groups_of_code, status, price)
        VALUES (%s, %s, %s, %s, %s, %s)
        """

        # hard coded until i get the actual data
        # new_code_data = code
        new_code_data = (
            'Jacob',                                                          # user_name
            json.dumps(['Python', 'Elasticsearch']),                          # code_languages
            'Data aggregation pipeline script, please go easy on me',         # description
            json.dumps(['Google', 'Amazon']),                                 # groups_of_code
            'waiting for review',                                             # status
            60                                                                # price
        )


        cursor.execute(insert_query, new_code_data)
        connection.commit()

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
    finally:
        cursor.close()
        connection.close()



add_to_codes(1)






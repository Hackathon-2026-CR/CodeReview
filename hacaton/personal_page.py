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
# actions on the db

def assign_reviewer(code_title, reviewer):
    """
    Updates a code request to assign a reviewer and change its status to 'review in process'.
    """
    
    if connection and cursor:
        try:
            update_query = """
            UPDATE codes 
            SET reviewer = %s, status = 'review in process'
            WHERE title = %s
            """
            
            reviewer_name = reviewer['name']
            
            cursor.execute(update_query, (reviewer_name, code_title))
            
            connection.commit()
            
            if cursor.rowcount > 0:
                print(f"Success: '{code_title}' is now being reviewed by {reviewer_name}.")
            else:
                print(f"Warning: No code found with the title '{code_title}'.")
                
        except mysql.connector.Error as err:
            print(f"Database error: {err}")
        
active_reviewer = {
        'name': 'Jacob',
        'credits': 300,
        'rating': 4.2
    }
    

# assign_reviewer('SQL Window Functions', active_reviewer)    


def finished_to_review(code_title):
    try:
        update_query = """
        UPDATE codes 
        SET status = 'reviewed'
        WHERE title = %s
        """
        
        
        cursor.execute(update_query, (code_title))
        
        connection.commit()
        
        if cursor.rowcount > 0:
            print(f"Success")
        else:
            print(f"Warning: No code found with the title '{code_title}'.")
            
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
    

# ---------------------------------------------------------------


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
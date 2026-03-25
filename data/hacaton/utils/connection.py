import mysql.connector
from mysql.connector import errorcode
import os
from dotenv import load_dotenv

load_dotenv()

config = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'root'),
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'database': os.getenv('DB_NAME', 'db')
}

def get_connection():
    """
    Creates and returns a MySQL database connection and cursor.
    Returns (connection, cursor) on success, or (None, None) if it fails.
    """
    try:
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor(buffered=True) 
        return connection, cursor
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Error: Invalid username or password.")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Error: Database does not exist.")
        else:
            print(f"Database error: {err}")
        return None, None

get_connection()

def close_connection(connection, cursor):
    if cursor is not None:
        try:
            cursor.close()
        except Exception as e:
            print(f"Error closing cursor: {e}")
            
    if connection is not None and connection.is_connected():
        try:
            connection.close()
        except Exception as e:
            print(f"Error closing connection: {e}")

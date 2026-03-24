import mysql.connector
import json
from decimal import Decimal
from hacaton.utils.connection import get_connection

connection, cursor = get_connection()


def add_to_users(user):
    """
    Add user to users table.
    Expects: {"name": "...", "password": "...", "credits": 200, ...}
    """
    try:
        insert_query = """
        INSERT INTO users (name, password, credits, `groups`, price, rating, languages)
        VALUES (%(name)s, %(password)s, %(credits)s, %(groups)s, %(price)s, %(rating)s, %(languages)s)
        """

        user_data = user.copy()
        user_data["groups"] = json.dumps(user.get("groups", []))
        user_data["languages"] = json.dumps(user.get("languages", []))

        cursor.execute(insert_query, user_data)
        connection.commit()
        return {"response": f"user '{user['name']}' added"}

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return {"error": f"Database error: {err}"}
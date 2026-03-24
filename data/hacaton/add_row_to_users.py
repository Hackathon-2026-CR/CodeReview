import mysql.connector
import json
from decimal import Decimal
from hacaton.utils.connection import get_connection

connection, cursor = get_connection()


def add_to_users(name: str, password: str):
    try:
        insert_query = """
        INSERT INTO users (name, password)
        VALUES (%(name)s, %(password)s)
        """  # ← Only name/password - others use DB defaults

        user_data = {
            "name": name,
            "password": password
        }

        cursor.execute(insert_query, user_data)
        connection.commit()
        return {"response": f"user '{name}' added (credits=200, groups=[], etc.)"}

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return {"error": f"Database error: {err}"}
    

def update_user_profile(name: str, groups=None, price=None, languages=None):
    try:
        updates = []
        params = {"name": name}
        
        if groups is not None:
            updates.append("`groups` = %(groups)s")
            params["groups"] = json.dumps(groups)
        if price is not None:
            updates.append("price = %(price)s")
            params["price"] = price
        if languages is not None:
            updates.append("languages = %(languages)s")
            params["languages"] = json.dumps(languages)
        
        if not updates:
            return {"response": "No fields to update"}
        
        query = f"UPDATE users SET {', '.join(updates)} WHERE name = %(name)s"
        cursor.execute(query, params)
        connection.commit()
        
        return {"response": f"Updated {cursor.rowcount} profile"} if cursor.rowcount else {"error": f"User '{name}' not found"}
    
    except mysql.connector.Error as err:
        return {"error": str(err)}
    


# @router.patch('/users/{name}')
# def update_user(name: str, update_data: UserUpdate):
#     return dal.update_user_profile(name=name,groups=update_data.groups,price=update_data.price,languages=update_data.languages)


# from typing import List | None

# class UserUpdate(BaseModel):
#     groups: List[str] | None = None
#     price: int | None = None
#     languages: List[str] | None = None